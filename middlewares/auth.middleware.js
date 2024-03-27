const jwt = require("jsonwebtoken");
const Config = require("../configs/auth.config");
const User = require("../models/user.model");
const Util = require("../utils/util");
const { blacklistedTokens } = require('../controllers/auth.controller');


/**
 * Middleware to validate the request body for user sign-in.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
validateSigninRequest = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Failed! Email and password are required.",
            statusCode: 400,
        });
    }
    next();
};

/**
 * Middleware to validate the request body for user sign-up.
 * Checks for the existence of user ID, email, and uniqueness of user ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
validateSignupRequest = async (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.userId) {
        return res.status(400).send({
            message: "Failed! email, userId and password are required.",
            statusCode: 400,
        });
    }

    if (!Util.validateEmail(req.body.email)) {
        return res.status(400).send({
            message: "Failed! Invalid email format.",
            statusCode: 400,
        });
    }

    if (!Util.validatePassword(req.body.password)) {
        return res.status(400).send({
            message: "Failed! Invalid password format. Password should be min 8 length, with at least a symbol," +
                " upper and lower case letters and a number",
            statusCode: 400,
            success: false,
        });
    }
    next();
};

/**
 * Middleware to verify the JWT token provided in the request headers.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Next middleware function.
 */
verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized! No token provided.",
            statusCode: 401,
            success: false,
        });
    }

    // Check if the token is blacklisted    
    if (blacklistedTokens.includes(token)) {
        return res.status(401).json({
            message: "Token has been invalidated",
            statusCode: 401,
            success: false,
        });
    }

    // Verify the token
    jwt.verify(token, Config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: `Unauthorized! Token expired, please create a new token.`,
                statusCode: 401,
                success: false,
            });
        }
        req.userId = decoded.id;
        next();
    });
};

/**
 * Middleware object containing various authentication functions.
 */
const authUser = {
    validateSignupRequest: validateSignupRequest,
    validateSigninRequest: validateSigninRequest,
    verifyToken: verifyToken,
};

module.exports = authUser;
