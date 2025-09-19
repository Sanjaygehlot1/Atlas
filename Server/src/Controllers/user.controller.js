import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import User from "../Models/students.model.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
};


const signInUser = AsyncHandler(async (req, res) => {
  const decodedToken = req.user;

  console.log(decodedToken)

  const user = await User.findOneAndUpdate(
    { uid: decodedToken.uid }, 
    {
      $set: {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        isVerified: decodedToken.email_verified,
      },
    },
    { new: true, upsert: true } 
  );

  console.log(user)
  const message = user.createdAt === user.updatedAt
    ? "Account created successfully."
    : "User updated successfully.";

  return res.status(200).json(
    new ApiResponse(200, { user }, message)
  );
});






const logoutUser = AsyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});



const updateAcademicInfo = AsyncHandler(async (req, res) => {
    const { year, department, rollNo, studentClass, dob, gender,contactNumber } = req.body;

    console.log(year, department, rollNo, studentClass, dob, gender,contactNumber)
    if (!year || !department || !rollNo || !studentClass || !dob || !gender || !contactNumber) {
        console.log( year, department, rollNo, studentClass, dob, gender,contactNumber)
        throw new ApiError(400, "All fields are required");
    }
    
    const decodedToken = req.user;
    const uid = decodedToken?.uid;
    if(!uid) {
        throw new ApiError(401, "Unauthorized access");
    }

    const updatedUser = await User.findOneAndUpdate(
        { uid },
        {
            $set: {
                year,
                department,
                rollNo,
                class: studentClass,
                hasFilledDetails: true,
                dob : dob.split('T')[0],
                gender,
                phone : contactNumber
            },
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedUser, "Academic details updated successfully."));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
    
    const decodedToken = req.user;
    if (!decodedToken?.uid) {
        throw new ApiError(401, "Unauthorized access");
    }


    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {        
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully."));

})
export {
    signInUser,
    logoutUser,
    updateAcademicInfo,
    getCurrentUser,
};
