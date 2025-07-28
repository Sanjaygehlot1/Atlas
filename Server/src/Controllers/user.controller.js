import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import User from "../Models/students.model.js";
import { sendVerificationEmail } from "../Utils/sendEmail.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
};

import crypto from 'crypto';



const registerUser = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!email.endsWith('@atharvacoe.ac.in')) {
        throw new ApiError(400, "Only emails from @atharvacoe.ac.in are allowed.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
        throw new ApiError(409, "A verified account with this email already exists.");
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    let user;
    if (existingUser) {
        user = existingUser;
        user.name = name;
        user.password = password;
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = verificationCodeExpiry;
    } else {
        user = new User({
            name,
            email,
            password, 
            verificationCode,
            verificationCodeExpiry,
        });
    }

    await user.save();


   const sendMail=  await sendVerificationEmail(email, name, verificationCode);

   if(sendMail.rejected.length > 0) {
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }

    return res.status(201).json(
        new ApiResponse(201, { email: user.email }, "Verification code sent successfully. Please check your email.")
    );
});

const verifyUser = AsyncHandler(async (req, res) => {
    const { code, email } = req.body;
    console.log('Verification Code:', code, 'Email:', email);
    if (!code || !email) {
        throw new ApiError(400, "Code and email are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }
    if (user.verificationCodeExpiry < new Date()) {
        throw new ApiError(400, "Verification code has expired");
    }
    if (user.verificationCode !== code) {
        throw new ApiError(400, "Invalid verification code");
    }
    user.isVerified = true;
    user.verificationCode = undefined; 
    user.verificationCodeExpiry = undefined; 
    await user.save();
    return res.status(200).json(new ApiResponse(200, { email: user.email }, "User verified successfully"));

})



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

export {
    registerUser,
    loginUser,
    logoutUser,
    updateAcademicInfo,
    getCurrentUser,
    verifyUser
};
