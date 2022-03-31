const passport = require('passport');
const session = require('express-session');

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const keys = require('../config/keys');

passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) => {
        done(err,user);
    });
});

passport.use(new FacebookStrategy({
    clientID: keys.FacebookAppID,
    clientSecret:keys.FacebookAppSecret,
    callbackURL: 'https://sleepy-fjord-64230.herokuapp.com/auth/facebook/callback',
    profileFields: ['email','name','displayName','photos']
},(accessToken, refreshToken, profile,done) => {
    console.log(profile);
    User.findOne({facebook:profile.id},(err,user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            console.log(user)
            session.currentUser = user;
            return done(null,user);
        }else{
            const newUser = {
                facebook: profile.id,
                fullname: profile.displayName,
                lastname: profile.name.familyName,
                firstname: profile.name.givenName,
                image: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                email: profile.emails[0].value
            }
            var usr = new User(newUser);
            session.currentUser = usr;
            
            usr.save((err,user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null,user);
                }
            });
        }
    });
}));