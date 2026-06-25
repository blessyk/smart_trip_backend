const Trip = require('../models/Trip');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all trips of the logged-in user
 * @route   GET /api/trips
 * @access  Private
 */
const getUserTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User trips retrieved successfully',
      data: {
        trips
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single trip by ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new ApiError(404, `Trip not found with ID ${req.params.id}`));
    }

    // Secure that users can only fetch their own trips (unless admin)
    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to view this trip'));
    }

    res.status(200).json({
      success: true,
      message: 'Trip retrieved successfully',
      data: {
        trip
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/Save a trip manually
 * @route   POST /api/trips
 * @access  Private
 */
const createTrip = async (req, res, next) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user._id
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      message: 'Trip saved successfully',
      data: {
        trip
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a trip manually
 * @route   PUT /api/trips/:id
 * @access  Private
 */
const updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new ApiError(404, `Trip not found with ID ${req.params.id}`));
    }

    // Secure: Check ownership
    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to modify this trip'));
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: {
        trip
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new ApiError(404, `Trip not found with ID ${req.params.id}`));
    }

    // Secure: Check ownership
    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to delete this trip'));
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all trips in system (Admin view)
 * @route   GET /api/admin/trips
 * @access  Private/Admin
 */
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All trips retrieved for admin',
      data: {
        trips
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getAllTrips
};
