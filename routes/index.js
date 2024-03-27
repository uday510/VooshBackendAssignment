const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const initializeGoogleAuth = require('../controllers/googleLogin.controller');

module.exports = (app) => {
    authRoutes(app),
    initializeGoogleAuth(app),
    userRoutes(app),
    app.get("/v1", (req, res) => res.send("Welcome"));
}