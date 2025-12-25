import {v2 as cloudinary} from "cloudinary";
import fs from "fs";



cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file to cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
        })

        //file has been uploaded successfully
        //console.log("File uploaded successfully" , response.url);
        //ye humne bs testing purpose ke liye rkha tha ki if upload hori h
        //to pta chal jayee vrna ab to upload ho jaye chahe na hm unlink kr denge
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("❌ CLOUDINARY UPLOAD FAILED:", error);
        fs.unlinkSync(localFilePath) //remove the locally saved file 
        //as the upload operation got failed

        
    }

} 

export {uploadOnCloudinary};

