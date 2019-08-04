
const googleStrategy  = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys =require('../config/keys');
require('../models/user');
const User=mongoose.model('users');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new googleStrategy({
    clientID:keys.googleClientID,
    clientSecret:keys.googleClientSecret,
    callbackURL:'/auth/google/callback',
    proxy:true
  }, (accessToken,refreshToken,profile,done) => {
      
    //console.log(accessToken);
    //console.log(profile);
    
    User.findOne({googleID:profile.id}, (err, user) => {
      if(err){
         return done(err);
      }
      
      if(user){
          return done(null, user);
      }else{

        const image=profile.photos[0].value.substring(0,
          profile.photos[0].value.indexOf('?'));

          const newUser = new User();
          newUser.googleID = profile.id;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.image =image;
    
          newUser.save((err) => {
            console.log(newUser);
              if(err){
                  return done(err)
                  
              }
              return done(null, newUser);
          })
      }
  })
}));
}