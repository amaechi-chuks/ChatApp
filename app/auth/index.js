const passport = require("passport");
const config = require("../config");
const ultility = require("../ultis");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = () => {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        //Find the user using the _id
        ultility.findById(id)
        .then(user => done(null, user))
        .catch(error => console.log('Error When deserializing user data'));
    })

    let authProcess = (accessToken, refreshToken, profile, done) => {
        //find a user in the DB using profile.id
        //if the user is found, return the user data using done()
        //if the user is not found, create one in the local Db and return
        ultility.findOne(profile.id)
        .then(result => {
            if(result) {
                done(null, result)
            }else{
                //create a new user ans return
                ultility.createNewUser(profile)
                .then(newChatUser => done(null, newChatUser))
                .catch(error => console.log('Error when creating new Users'));
            }
        })
        
    }
    passport.use(new FacebookStrategy(config.fb, authProcess));
    passport.use(new TwitterStrategy(config.twitter, authProcess));
    passport.use(new GoogleStrategy(config.google, authProcess));
}
