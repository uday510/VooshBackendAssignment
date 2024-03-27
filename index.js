/**
 * Module dependencies.
 * @module server
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./configs/db.config.js');
const serverConfig = require('./configs/server.config.js');

/**
 * Express application.
 * @type {express.Application}
 */
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Middleware that logs the time for every request.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
function requestTime(req, res, next) {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

app.use(requestTime);


// Initialize routes
require("./routes/index.js")(app);

// Google button on homepage
/**
 * Homepage route.
 * @function
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
app.get('/', (req, res) => {
    // Render a button for Google authentication
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Google Login</title>
        </head>
        <body>
            <button><a href='/auth'>Login With Google</a></button>
        </body>
        </html>
    `);
});

// Start the server
/**
 * Connect to the database and start the server.
 */
async function startServer() {
    try {
        await mongoose.connect(dbConfig.DB_URL);
        console.log("Connected to the database!");
        app.listen(serverConfig.PORT, () => {
            console.log(`Server is running on port ${serverConfig.PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
}

startServer();

/**
 * Express application instance.
 * @type {express.Application}
 * @exports app
 */
module.exports = app;
