import  User  from "../Models/students.model.js"
import { ApiError } from "../Utils/ApiError.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"
import jwt from 'jsonwebtoken'


const AuthMiddleware = AsyncHandler(async (req,res,next)=>{
    try {
        const token = await req.cookies?.accessToken
        if(!token){
            throw new ApiError(401, "Unauthorized Access")
        }

        const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(404, "User Not Found")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500 , error.message)
    }
})

export {AuthMiddleware}