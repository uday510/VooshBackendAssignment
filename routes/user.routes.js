const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Sets up user profile-related routes.
 *
 * @param {Object} app - Express app object.
 */
module.exports = (app) => {
  /**
   * Route for getting logged-in user's profile details.
   *
   * @name GET /v1/profile
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} authMiddleware.authenticateToken - Middleware to authenticate user token.
   * @param {Function} userController.getProfile - Controller for getting user profile details.
   */
  app.get("/v1/profile", authMiddleware.verifyToken, userController.getProfile);

  /**
   * Route for updating logged-in user's profile details.
   *
   * @name PUT /v1/profile
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} authMiddleware.verifyToken - Middleware to authenticate user token.
   * @param {Function} userController.updateProfile - Controller for updating user profile.
   */
  app.put("/v1/profile", authMiddleware.verifyToken, userController.updateProfile);

  /**
   * Route for uploading a new photo for the logged-in user's profile.
   *
   * @name PUT /v1/profile/photo
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} authMiddleware.verifyToken - Middleware to authenticate user token.
   * @param {Function} userController.uploadPhoto - Controller for uploading user profile photo.
   */
  app.put("/v1/profile/photo", authMiddleware.verifyToken, userController.uploadPhoto);

  /**
   * Route for updating logged-in user's profile privacy setting.
   *
   * @name PUT /v1/profile/privacy
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} authMiddleware.verifyToken - Middleware to authenticate user token.
   * @param {Function} userController.updateProfilePrivacy - Controller for updating user profile privacy.
   */
  app.put("/v1/profile/privacy", authMiddleware.verifyToken, userController.updateProfilePrivacy);

  /**
   * Route for getting user profiles (public and private) for admin users.
   *
   * @name GET /v1/profiles
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} authMiddleware.verifyToken - Middleware to authenticate user token.
   * @param {Function} userController.getAllProfilesForAdmin - Controller for getting all user profiles for admin users.
   */
  app.get("/v1/profiles/", authMiddleware.verifyToken, userController.getAllProfilesForAdmin);

  /**
   * Route for getting user profiles (public only) for normal users.
   *
   * @name GET /v1/profiles/public
   * @function
   * @memberof module:routes/userProfileRoutes
   * @inner
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} userController.getPublicProfilesForNormalUser - Controller for getting public user profiles for normal users.
   */
  app.get("/v1/profiles/public", authMiddleware.verifyToken, userController.getPublicProfilesForNormalUser);
};
