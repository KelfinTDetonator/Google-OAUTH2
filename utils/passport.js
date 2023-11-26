const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { users } = require('../src/models/index');

async function googleAuth(clientID, clientSecret, callbackURL){
    const test = passport.use(new GoogleStrategy( {
        clientID,
        clientSecret,
        callbackURL,
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            const user = await users.upsert({
                where:{ email: profile.emails[0].value },
                update: { googleId: profile.id },
                create: {
                    email: profile.emails[0].value,
                    googleId: profile.id
                }
            })

            done(null, user)
        } catch (error) {
            done(error, null)
        }
    } )
    )
    return test
}

module.exports = {googleAuth}
