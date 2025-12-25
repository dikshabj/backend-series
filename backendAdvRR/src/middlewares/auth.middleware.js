import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
//yha response khali h isiliye uski jgh underscore lga dia
export const  verifyJWT = asyncHandler(async(req , _ , next)=>{
    //jruri ni h cookies me hi token ho  ho skta h user headers me bhej rha ho
   try {
     const token = req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer " , "")
 
     if(!token){
         throw new ApiError(401 , "Unauthorized request")
     }
 
     const decodedToken = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401 , "Invalid AccessToken")
     }
 
     req.user = user;
     next()
   } catch (error) {
    throw new ApiError(401 , error?.message || "invalid access token")
    
   }
})