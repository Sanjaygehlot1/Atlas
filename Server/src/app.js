import express from 'express';
import timetableRoutes from './Routes/timetable.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/user.routes.js';
import noteRoutes from './Routes/notes.routes.js';
import User from './Models/students.model.js';
import passport from "passport"
import session from "express-session"
import "./auth/googleAuth.js"  // Import strategy
import jwt from 'jsonwebtoken'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())


app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// Redirect to Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"]}
))

// Google callback route
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            const profile = req.user;

            // Upsert user in DB

            if(profile.email && !profile.email.endsWith("@atharvacoe.ac.in")){
                
                return res.redirect('http://localhost:5173/unauthorized');

            }

            const user = await User.findOneAndUpdate(
                { googleId: profile.googleId }, // search by Google ID
                {
                    $set: {
                        name: profile.name,
                        email: profile.email,
                        picture: profile.picture,
                        accessToken: profile.accessToken,
                        refreshToken: profile.refreshToken,
                    },
                },
                { new: true, upsert: true }
            );

            // Create JWT with Mongo _id
            const token = jwt.sign(
                {
                    _id: user._id,          
                    googleId: user.googleId,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.cookie("token", token, { httpOnly: true });
            if (user.hasFilledDetails) {
                res.redirect("http://localhost:5173/student/dashboard");
            } else {
                res.redirect("http://localhost:5173/student/academic-info");
            }
        } catch (err) {
            console.error(err);
            res.redirect("/login");
        }
    }
);


app.get("/profile", (req, res) => {
    res.json(req.user || null)
})



// Routes

app.use('/api/timetable', timetableRoutes);
app.use('/api/users', userRouter); // localhost:8000/api/users/auth/verify {POST}
app.use('/api/notes', noteRoutes);


app.use(express.static("public"))
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || null,
        stack,
    });
});

export default app;
