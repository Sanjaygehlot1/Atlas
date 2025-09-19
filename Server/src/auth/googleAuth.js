import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {

           const user = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                accessToken,
                refreshToken
            }

        
            return done(null, user)
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})
