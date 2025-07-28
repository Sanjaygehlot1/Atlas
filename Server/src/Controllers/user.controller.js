import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import User from "../Models/students.model.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
};

const registerUser = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!email.endsWith('@atharvacoe.ac.in')) {
        throw new ApiError(400, "Only emails from @atharvacoe.ac.in are allowed.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json(
        new ApiResponse(201, { userId: user._id , userdata: user}, "User registered successfully. Please log in.")
    );
});

const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
});

// --- 3. Logout User ---
const logoutUser = AsyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const updateAcademicInfo = AsyncHandler(async (req, res) => {
    const { year, department, rollNo, studentClass } = req.body;
    if (!year || !department || !rollNo || !studentClass) {
        throw new ApiError(400, "All fields are required");
    }
    const userId = req.user?._id;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                year,
                department,
                rollNo,
                class: studentClass,
                hasFilledDetails: true,
            },
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Academic details updated successfully."));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully."));
});

export { registerUser, loginUser, logoutUser, updateAcademicInfo, getCurrentUser };
