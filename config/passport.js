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
    clientID:     "786456465930-jpboqed1plk4l2m51bjp0h9re8b41fr6.apps.googleusercontent.com",
    clientSecret: "rydamzwFh1qAt9mcGweHPZZV",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile)
      return done(null, profile);
    }
));