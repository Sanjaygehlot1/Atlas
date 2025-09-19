import User from "../Models/students.model.js"; // your user model
import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import admin from "../firebase/firebaseAdmin.js";

const AuthMiddleware = AsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log(token)

    if (!token) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken)

  
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new ApiError(500, error.message));
  }
});


const verifyToken = async (req,res,next) =>{
  try {
      const request = req.headers;
      console.log(request)
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
      return new ApiError(401, "No token provided");
    }
    console.log(token)

    const decodedToken = await admin.auth().verifyIdToken(token, true)

    req.user = decodedToken;

    next()
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

export { AuthMiddleware, verifyToken };
