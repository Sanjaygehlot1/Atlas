import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})
passport.use(
    new GoogleStrategy(
        {
            clientID: "484804775446-e78o9bvv54n6ngmddf8rgfui3akh28d1.apps.googleusercontent.com",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
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
