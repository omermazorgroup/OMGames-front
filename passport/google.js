const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const keys = require('../config/keys');
const user = require('../models/user');

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        return done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID : keys.GoogleClientID,
    clientSecret : keys.GoogleClientSecret,
    callbackURL : 'https://sleepy-fjord-64230.herokuapp.com/auth/google/callback'
},(accessToken, refreshToken, profile, done) => {
    console.log(profile);

    user.findOne({google : profile.id}, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            return done (null, user);
        }else {
            const newUser = {
                firstname : profile.name.givenName,
                lastname : profile.name.familyName,
                image : profile.photos[0].value,
                fullname : profile.displayName,
                google : profile.id
            }
            new User(newUser).save((err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                    
                });
        }
    });
}));