const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local').Strategy;

const keys = require('../config/config').keys;

MongoClient.connect(keys.mongoURI, (err, db) => {
    if (err) console.log(err.stack);
    console.log('Successfully connected to db for auth');

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
  
    passport.deserializeUser((id, done) => {
        db.collection('users').findOne({ _id: ObjectID(id) }, {authID:0}, (err, user) => {
            if (err) console.log(err.stack);
            done(null, user);
        });
    });
    
    passport.use(new GoogleStrategy({ //Log into existing accounts with google email
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => {
        //default user object with auth id
        const userObj = {
            authID: profile.id, email: profile.emails[0].value
        };
        db.collection('users').findOne({email: userObj.email}, (err, doc) => {
            if (err) console.log(err.stack);
            if (!doc) {
                done(null, false);
            } else {
                db.collection('users').update({email: userObj.email}, {$set:{authID: profile.id}}, (err) => {
                    if (err) console.log(err.stack);
                    else {
                        console.log(`user with email ${userObj.email} logged in`);
                        done(null, doc);
                    }
                });
            }
        });
    }));
    //authID: profile.id, 
    passport.use(new LocalStrategy((email, password, done) => { //Authenticates accounts stored in mongo
        db.collection('users').findOne({email: email, password: password}, {password: 0}, function(err, user) {
            if (err) {
                done(err);
            } else if (!user) {
                return done(null, false);
            } else {
                console.log(user.email + ' has logged in');
                return done(null, user);
            }
        });
    }));
    
});