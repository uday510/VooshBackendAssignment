const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');

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

  app.get('/auth/callback/success', (req, res) => {
    if (!req.user) {
      res.redirect('/auth/callback/failure');
    } else {
      res.send("Welcome " + req.user.email);
    }
  });

  app.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
  });
}

module.exports = initializeGoogleAuth;
