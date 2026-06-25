const User = require('../models/User');
const AiLog = require('../models/AiLog');
const Setting = require('../models/Setting');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const startIndex = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { aadharNumber: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new ApiError(404, `User not found with ID ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, `User not found with ID ${req.params.id}`));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all AI request/response logs
 * @route   GET /api/admin/ai-logs
 * @access  Private/Admin
 */
const getAiLogs = async (req, res, next) => {
  try {
    const logs = await AiLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'AI logs retrieved successfully',
      data: {
        logs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Gemini Model configuration setting
 * @route   GET /api/admin/settings/gemini-model
 * @access  Private/Admin
 */
const getGeminiModelSetting = async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: 'GEMINI_MODEL' });
    if (!setting) {
      setting = { key: 'GEMINI_MODEL', value: 'gemini-flash-latest' };
    }
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Gemini Model configuration setting
 * @route   PUT /api/admin/settings/gemini-model
 * @access  Private/Admin
 */
const updateGeminiModelSetting = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (!value) return next(new ApiError(400, 'Model value is required'));

    const setting = await Setting.findOneAndUpdate(
      { key: 'GEMINI_MODEL' },
      { value },
      { returnDocument: 'after', upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Gemini model setting updated successfully',
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of available Gemini models from Google API
 * @route   GET /api/admin/settings/gemini-available-models
 * @access  Private/Admin
 */
const getAvailableGeminiModels = async (req, res, next) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Default fallback models
    const fallbackModels = [
      { value: 'gemini-flash-latest', label: 'gemini-flash-latest (Fastest/Default)' },
      { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
      { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
      { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
      { value: 'gemini-3.5-flash', label: 'gemini-3.5-flash' }
    ];

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        data: fallbackModels
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const result = await response.json();
    if (!result.models || !Array.isArray(result.models)) {
      throw new Error('Invalid response structure from Gemini models API');
    }

    // Filter and map models that support generateContent
    const filteredModels = result.models
      .filter(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent') &&
        m.name &&
        m.name.toLowerCase().includes('gemini') &&
        !m.name.toLowerCase().includes('embedding') &&
        !m.name.toLowerCase().includes('aqa') &&
        !m.name.toLowerCase().includes('robotics')
      )
      .map(m => {
        const rawName = m.name;
        const cleanName = rawName.startsWith('models/') ? rawName.substring(7) : rawName;
        return {
          value: cleanName,
          label: `${cleanName} (${m.displayName || cleanName})`
        };
      });

    // If no text-generation models match, use fallback
    if (filteredModels.length === 0) {
      return res.status(200).json({
        success: true,
        data: fallbackModels
      });
    }

    // Sort to place gemini-flash-latest at the top, then alphabetically
    filteredModels.sort((a, b) => {
      if (a.value === 'gemini-flash-latest') return -1;
      if (b.value === 'gemini-flash-latest') return 1;
      return a.value.localeCompare(b.value);
    });

    res.status(200).json({
      success: true,
      data: filteredModels
    });
  } catch (error) {
    console.error('Error fetching available Gemini models:', error);
    // Return standard fallback models if fetch fails
    res.status(200).json({
      success: true,
      data: [
        { value: 'gemini-flash-latest', label: 'gemini-flash-latest (Fastest/Default)' },
        { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
        { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
        { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
        { value: 'gemini-3.5-flash', label: 'gemini-3.5-flash' }
      ]
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  getAiLogs,
  getGeminiModelSetting,
  updateGeminiModelSetting,
  getAvailableGeminiModels
};
