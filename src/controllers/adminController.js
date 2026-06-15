const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
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

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
};
