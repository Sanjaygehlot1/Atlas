import express from 'express';
import timetableRoutes from './Routes/timetable.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/user.routes.js';
import noteRoutes from './Routes/notes.routes.js';




const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

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
