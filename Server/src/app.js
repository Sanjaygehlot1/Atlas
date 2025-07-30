import express from 'express';
import timetableRoutes from '../src/Routes/timetable.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/user.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Routes

app.use('/api/timetable', timetableRoutes); 
app.use('/api/users', userRouter); // localhost:8000/api/users/auth/verify {POST}

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
