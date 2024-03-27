const authRoutes = require("./auth.routes");
const initializeGoogleAuth = require('../controllers/googleLogin.controller');

module.exports = (app) => {
    authRoutes(app),
    initializeGoogleAuth(app);
    app.get("/v1", (req, res) => res.send("Welcome"));
}