import express from 'express';
import timetableRoutes from './Routes/timetable.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/user.routes.js';
import noteRoutes from './Routes/notes.routes.js';
import User from './Models/students.model.js';
import passport from "passport"
import session from "express-session"
import "./auth/googleAuth.js"
import jwt from 'jsonwebtoken'
import cron from "node-cron";
import { Timetable } from "./Models/timetable.model.js";
import { Lecture } from "./Models/currentLecture.model.js";


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
app.set('trust proxy', 1)

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }
))

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            const profile = req.user;


            if (profile.email && !profile.email.endsWith("@atharvacoe.ac.in")) {

                return res.redirect('http://localhost:5173/unauthorized');

            }

            const user = await User.findOneAndUpdate(
                { googleId: profile.googleId },
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

            console.log("User :: ", user)

            const token = jwt.sign(
                {
                    _id: user._id,
                    googleId: user.googleId,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            console.log("Generated Token:", token);

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge : 1000 * 60 * 60 * 24,
            }

            res.cookie("token", token, options);
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

cron.schedule("0 0 * * *", async () => {
    try {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB')
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

        console.log(`⏰ Running daily timetable job for ${dayOfWeek}`);

        const templateLectures = await Timetable.find({ day: dayOfWeek });

        if (!templateLectures.length) {
            console.log("⚠️ No timetable entries found for today.");
            return;
        }

        const lectures = templateLectures.map(t => ({
            timetableRef: t._id,
            year: t.year,
            class: t.class,
            subjectName: t.subjectName,
            faculty: t.faculty,
            rooms: t.rooms,
            lectureType: t.lectureType,
            timeSlot: t.timeSlot,
            date: formattedDate,
            status: "Scheduled"
        }));

        await Lecture.insertMany(lectures);
        console.log("✅ Today’s lectures inserted successfully.");
    } catch (err) {
        console.error("❌ Cron job failed:", err.message);
    }
});




app.use('/api/timetable', timetableRoutes);
app.use('/api/users', userRouter);
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
