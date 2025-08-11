import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import { ApiError } from './ApiError.js';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadoncloudinary = async (filepath) => {
    try {
        if (!filepath) return null

        const response = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        })
        //file uploaded successfully

        fs.unlinkSync(filepath)
        return response;
    } catch (error) {
        fs.unlinkSync(filepath) // removes the locally saved temporary file as the upload operation got failed

        return null;
    }
}


const DeleteCloudinary = async (public_id)=>{
    try {
        if (!public_id) return null;

    const deleted = await cloudinary.uploader.destroy(public_id,{
        resource_type:"image"
    })
    return deleted
    } catch (error) {
        throw new ApiError(401,error.message)
    }
}
export { uploadoncloudinary , DeleteCloudinary}