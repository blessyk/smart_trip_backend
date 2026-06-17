const Destination = require('../models/Destination');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create a new destination
 * @route   POST /api/destinations
 * @access  Private/Admin
 */
const createDestination = async (req, res, next) => {
  try {
    const { name, country, category, description, price, duration, images } = req.body;

    const destination = await Destination.create({
      name,
      country,
      category,
      description,
      price,
      duration,
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all destinations
 * @route   GET /api/destinations
 * @access  Public
 */
const getAllDestinations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    
    const startIndex = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const total = await Destination.countDocuments(query);
    
    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    const destinations = await Destination.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Destinations retrieved successfully',
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: {
        destinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific destination by ID
 * @route   GET /api/destinations/:id
 * @access  Public
 */
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return next(new ApiError(404, `Destination not found with ID ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      message: 'Destination retrieved successfully',
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update destination details
 * @route   PUT /api/destinations/:id
 * @access  Private/Admin
 */
const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return next(new ApiError(404, `Destination not found with ID ${req.params.id}`));
    }

    const { name, country, category, description, price, duration, images } = req.body;

    if (name) destination.name = name;
    if (country) destination.country = country;
    if (category) destination.category = category;
    if (description) destination.description = description;
    if (price !== undefined) destination.price = price;
    if (duration) destination.duration = duration;
    if (images) destination.images = images;

    const updatedDestination = await destination.save();

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: {
        destination: updatedDestination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a destination
 * @route   DELETE /api/destinations/:id
 * @access  Private/Admin
 */
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return next(new ApiError(404, `Destination not found with ID ${req.params.id}`));
    }

    await Destination.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
