const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
})
passport.deserializeUser(function (user, done) {
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
  }
));
