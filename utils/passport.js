const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { users } = require('../src/models/index');
const {
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, 
    CALLBACK_ENDPOINT,
    CALLBACK_ENDPOINT_PROD,
} = process.env

passport.use(new GoogleStrategy( {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.NODE_ENV === "production") ? CALLBACK_ENDPOINT_PROD : CALLBACK_ENDPOINT,
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const user = await users.upsert({
            where:{ email: profile.emails[0].value },
            update: { googleId: profile.id },
            create: {
                email: profile.emails[0].value,
                googleId: profile.id,
            }
        })

        done(null, user)
    } catch (error) {
        done(error, null)
    }
} )
    )
    passport.serializeUser(function(user, done){
        done(null, user)
    })

    passport.deserializeUser(function(user, done){
        const err = new Error("Error is here")
        done(err, null)
    })
   
module.exports = passport
