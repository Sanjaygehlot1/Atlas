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


  const user = await User.findOneAndUpdate(
    { googleId: decodedToken.googleId },
    {
      $set: {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        accessToken: decodedToken.accessToken,
        refreshToken: decodedToken.refreshToken
      },
    },
    { new: true, upsert: true }
  );

  console.log("!!!! :: ",user)
  const message = user.createdAt === user.updatedAt
    ? "Account creation successful."
    : "Login successful.";

  return res.status(200).json(
    new ApiResponse(200, { user }, message)
  );
});






const logoutUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});



const updateAcademicInfo = AsyncHandler(async (req, res) => {
  const { year, department, rollNo, studentClass, dob, gender, contactNumber } = req.body;

  console.log(year, department, rollNo, studentClass, dob, gender, contactNumber)
  if (!year || !department || !rollNo || !studentClass || !dob || !gender || !contactNumber) {
    console.log(year, department, rollNo, studentClass, dob, gender, contactNumber)
    throw new ApiError(400, "All fields are required");
  }

  const decodedToken = req.user;
  const id = decodedToken?._id;
  if (!id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        year,
        department,
        rollNo,
        class: studentClass,
        hasFilledDetails: true,
        dob: dob.split('T')[0],
        gender,
        phone: contactNumber
      },
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedUser, "Academic details updated successfully.")).cookie("token", req.cookies.token, cookieOptions);
});

const getCurrentUser = AsyncHandler(async (req, res) => {

  const decodedToken = req.user;
  console.log("Decoded Token:", decodedToken);
  if (!decodedToken.googleId) {
    throw new ApiError(401, "Unauthorized access");
  }


  const user = await User.findOne({ googleId : decodedToken.googleId }).select("-refreshToken");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "session found"));

})
export {
  signInUser,
  logoutUser,
  updateAcademicInfo,
  getCurrentUser,
};
