const { TOKEN_EXPIRATION_TIME_SECONDS, UserType } = require('../utils/util');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../configs/auth.config");
const Util = require("../utils/util");

/**
 * Controller for user signup.
 * @module controllers/authController
 */

/**
 * Register a new account.
 * @function signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

exports.blacklistedTokens = [];

exports.signup = async (req, res) => {
    try {
        const { name, email, password, photo, bio, phone, userId } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                message: "Email already exists",
                success: false,
                statusCode: 400,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const social = {
            provider: Util.LOGIN_PROVIDER.EMAIL,
            socialId: email
        }

        const profile = {
            name,
            photo,
            bio,
            phone,
            privacy: req.body.privacy || Util.PROFILE_TYPE.PUBLIC
        }

        const newUser = new User({
            email,
            userId,
            password: hashedPassword,
            social,
            profile,
            role: req.body.role || Util.USER_TYPE.USER
        })

        // Save user to database
        await newUser.save();

        res.status(201).send({
            message: "User created successfully",
            data: {
                userId: newUser.userId,
                email: newUser.email,
                social: newUser.social,
                profile: newUser.profile,
                role: newUser.role
            },
            statusCode: 200,
            success: true,
        });
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
 * Handle successful Google login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.googleLogin = (req, res) => {
    // If authentication is successful, req.user will contain the authenticated user's information
    // For Google signin, the user information will already be populated by passport-google-oauth2 strategy
    if (req.user) {
        res.send(`Welcome, ${req.user.email}!`);
    } else {
        res.status(401).send({
            message: "Unauthorized",
            statusCode: 401,
            success: false
        });
    }
};

/**
 * Controller for user signin.
 * @function signin
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 */
exports.signin = async (req, res) => {
    try {
        // Search for the user by email
        const user = await User.findOne({ email: req.body.email });

        // Check if the user exists
        if (!user) {
            return res.status(400).send({
                statusCode: 400,
                message: "Failed! Email doesn't exist",
                success: false,
            });
        }

        // Check the type of login (email or google)

        if (user.social.provider === "google") { 
            return res.status(400).send({
                statusCode: 400,
                message: "Failed! Please login with Google",
                success: false,
            });
        }
        
        // Check if the entered password matches the stored hashed password
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

        // Handle invalid password
        if (!isPasswordValid) {
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid Password",
                success: false
            });
        }

        // Generate JWT token
        const token = this.generateToken(user.userId);

        // Send success response with token
        res.status(200).send({
            statusCode: 200,
            data: {
                email: user.email,
                accessToken: token,
                type: user.type,
            },
            message: "Token sent successfully",
            success: true,
        });
    } catch (err) {
        // Handle errors during user signin
        console.error(err.message);
        res.status(500).send({
            statusCode: 500,
            error: err.message,
            message: `Internal server error while signing user: ${err.message}`,
            success: false,
        });
    }
};

/**
 * Generates a JWT token based on the provided user ID.
 * @function generateToken
 * @param {string} userId - User ID for which the token is generated.
 * @returns {string} Generated JWT token.
 */
exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.secret, {
        expiresIn: TOKEN_EXPIRATION_TIME_SECONDS
    });
}

/**
 * Logout user by invalidating the token.
 * @function logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
exports.logout = (req, res) => {
    try {
        // Get the token from the request headers or cookies
        const token = req.headers["x-access-token"];

        // Check if the token exists
        if (!token) {
            return res.status(400).send({ message: "Token not provided" });
        }

        // Add the token to the blacklisted tokens array
        if (!this.blacklistedTokens.includes(token)) {
            this.blacklistedTokens.push(token);
        }

        res.send({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).send({ message: "Server Error" });
    }
};

