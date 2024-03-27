const mongoose = require('mongoose');
const Util = require("../utils/util");

/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} username - User's username
 * @property {string} email - User's email (used for login)
 * @property {string} password - User's password (hashed)
 * @property {Array<Object>} social - Array of objects containing social login information
 * @property {string} social.provider - Provider of social login (e.g., Google, Facebook)
 * @property {string} social.socialId - Unique identifier from the provider
 * @property {Object} profile - Object containing profile details
 * @property {string} profile.photo - URL to user's profile photo
 * @property {string} profile.name - User's name
 * @property {string} profile.bio - User's biography
 * @property {string} profile.phone - User's phone number
 * @property {string} profile.privacy - User's profile privacy setting ("public" or "private")
 * @property {string} role - User's role ("admin" or "user")
 */

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    social: {
        provider: String,
        socialId: String
    },
    profile: {
        photo: String,
        name: String,
        bio: String,
        phone: String,
        privacy: {
            type: String,
            enum: [Util.PROFILE_TYPE.PUBLIC, Util.PROFILE_TYPE.PRIVATE],
            default: Util.PROFILE_TYPE.PUBLIC
        }
    },
    role: {
        type: String,
        enum: [Util.USER_TYPE.USER, Util.USER_TYPE.ADMIN],
        default: Util.USER_TYPE.USER
    }
});

/**
 * User Model
 * @typedef {import('mongoose').Model<UserSchema>} User
 */

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
