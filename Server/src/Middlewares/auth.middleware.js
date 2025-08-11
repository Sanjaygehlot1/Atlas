import User from "../Models/students.model.js"; // your user model
import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

const AuthMiddleware = AsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      return next(new ApiError(404, "User Not Found"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(500, error.message));
  }
});


export { AuthMiddleware };
