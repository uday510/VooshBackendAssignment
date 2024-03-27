const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');
const User = require("../models/user.model");
const Util = require("../utils/util");
const authController = require("../controllers/auth.controller");

const initializeGoogleAuth = (app) => {
  app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: "1008367810267-crnc3cc1c9nbkdjj49paobq1o3fm8c7j.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4000/auth/callback",
    // callbackURL: "https://api.udayteja.com//auth/callback",
    passReqToCallback: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }));

  app.get('/auth', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
  }));

  app.get('/auth/callback',
    passport.authenticate('google', {
      successRedirect: '/auth/callback/success',
      failureRedirect: '/auth/callback/failure'
    }));

  app.get('/auth/callback/success', async (req, res) => {
    if (!req.user) {
      res.redirect('/auth/callback/failure');
    } else {
      console.log(req.user);
      /**
       * create a user in the database with the user details if not exists
       */

      const existingUser = await User.findOne({ email: req.user.email });

      if (existingUser) {

        // Generate token
        const token = authController.generateToken(existingUser);

        res.status(200).json({
          data: {
            email: existingUser.email,
            token: token
          },
          message: "Token sent successfully",
          success: true,
        });
      }

      const { email, picture } = req.user;
      const name = req.user.displayName;

      const social = {
        provider: Util.LOGIN_PROVIDER.GOOGLE,
        socialId: req.user.id
      }

      const profile = {
        name,
        photo: picture,
        privacy: Util.PROFILE_TYPE.PUBLIC
      }

      const newUser = new User({
        email,
        social,
        profile,
        role: Util.USER_TYPE.USER
      });

      // Save user to database
      await newUser.save();

      // Generate token

      const token = authController.generateToken(newUser);

      res.status(201).json({
        data,
        token: token,
        message: "User created successfully",
        success: true,
      });
    }
  });

  app.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
  });
}

module.exports = initializeGoogleAuth;
