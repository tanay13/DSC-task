const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(user, done) {

      done(null, user);
;
  });


passport.use(new GoogleStrategy({
    clientID:     "",
    clientSecret: "",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile)
      return done(null, profile);
    }
));
