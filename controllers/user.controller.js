const User = require('../models/user.model');
const Util = require('../utils/util');
/**
 * Controller for user profile-related operations
 * @module controllers/userProfileController
 */

/**
 * Get logged-in user's profile details
 * @function getProfile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.getProfile = async (req, res) => {
  try {
    // Retrieve user profile based on authenticated user's ID
    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // send total userdata without password

    user.password = undefined;
    // Respond with user profile details
    res.status(200).send({
      data: user,
      message: "User profile retrieved successfully",
      statusCode: 200,
      success: true,
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Server Error",
      statusCode: 500,
      success: false
    });
  }
};

/**
 * Update logged-in user's profile details
 * @function updateProfile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.updateProfile = async (req, res) => {
  try {
    // Retrieve user profile based on authenticated user's ID
    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      return res.status(400).send({
        statusCode: 400,
        message: "Failed! User doesn't exist",
        success: false,
      });
    }

    // photo, name, bio, phone, email, and password.

    user.password = req.body.password || user.password;
    user.name = req.body.name || user.name;
    user.profile.bio = req.body.bio || user.profile.bio;
    user.profile.phone = req.body.phone || user.profile.phone;
    user.email = req.body.email || user.email;

    // Save updated user profile
    await user.save();

    // Respond with updated profile details
    res.json({ profile: user.profile });
  } catch (err) {
    // Handle error
    console.error(err.message);
    res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: `Internal server error`,
      success: false,
    });
  }
};

/**
 * Upload a new photo or provide an image URL for the logged-in user's profile
 * @function uploadPhoto
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.uploadPhoto = async (req, res) => {
  try {
    // Retrieve user profile based on authenticated user's ID
    const user = await User.findOne({ userId: req.userId });

    if (!req.body.photo) { 
      return res.status(400).send({
        statusCode: 400,
        message: "Photo is required",
        success: false,
      })
    }

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
        success: false,
      })
    }

    // Update user's profile photo
    user.profile.photo = req.body.photo;

    // Save updated user profile
    await user.save();

    // Respond with success message
    res.status(200).send({
      statusCode: 200,
      message: "Profile photo updated successfully",
      success: true,
    })
  } catch (err) {
    // Handle error
    console.error(err.message);
    res.status(500).send({
      statusCode: 500,
      error: err.message,
      message: `Internal server error`,
      success: false,
    });
  }
};

/**
 * Update logged-in user's profile privacy setting
 * @function updateProfilePrivacy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.updateProfilePrivacy = async (req, res) => {
  try {
    // Retrieve user profile based on authenticated user's ID
    const user = await User.findOne({ userId: req.userId });
    if (!req.body.privacy) { 
      return res.status(400).send({
        statusCode: 400,
        message: "Privacy is required",
        success: false,
      })
    }

    if (req.body.privacy !== Util.PROFILE_TYPE.PUBLIC && req.body.privacy !== Util.PROFILE_TYPE.PRIVATE) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid privacy setting",
        success: false,
      })
     }

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
        success: false,
      })
    }

    // Update user's profile privacy setting
    user.profile.privacy = req.body.privacy;

    // Save updated user profile
    await user.save();

    // Respond with success message
    res.json({ message: "Profile privacy setting updated successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      statusCode: 500,
      success: false,
    })
  }
};

/**
 * Get user profiles (public and private) for admin users
 * @function getAllProfilesForAdmin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.getAllProfilesForAdmin = async (req, res) => {
  try {
    // Check if the current user is an admin

    const user = await User.findOne({ userId: req.userId });

    if (user.role !== Util.USER_TYPE.ADMIN) { 
      return res.status(403).send({
        statusCode: 403,
        message: "Unauthorized",
        success: false,
      })
    }

    // Retrieve all user profiles
    const users = await User.find();

    // remove password from user object

    users.forEach(user => {
      user.password = undefined;
    });

    // Respond with user profiles
    res.json({ users });
  } catch (err) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      statusCode: 500,
      success: false,
    })
  }
};

/**
 * Get user profiles (public only) for normal users
 * @function getPublicProfilesForNormalUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

exports.getPublicProfilesForNormalUser = async (req, res) => {
  try {
    // Retrieve public user profiles
    const users = await User.find({ 'profile.privacy': 'public' });

    //  remove password from user object

    users.forEach(user => {
      user.password = undefined;
    });
    
    // Respond with public user profiles
    res.status(200).send({
      data: users,
      message: "Public user profiles retrieved successfully",
      statusCode: 200,
      success: true,
    })
  } catch (err) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      statusCode: 500,
      success: false,
    })
  }
};
