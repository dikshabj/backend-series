import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const userSchema = new Schema({
     username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true, //to make search faster 

     },
     email : {
          type : String,
          required : true,
          unique : true,
          lowercase : true,
          trim : true,
     },
     fullname : {
        type : String,
        required : true,
        trim : true,
        index : true, //to make search faster 

     },
     avatar : {
          type : String, //cloudinary url
          required : true,
     },
     coverImage : {
          type : String, //cloudinary url
     },
     watchHistory : [
          {
               type : Schema.Types.ObjectId,
               ref : "Video",
          }
     ],
     password : {
          type : String,
          required : [true , "Password is required"], //HUM hmesha true field ke sath ek message de skte hai
     },
     refreshToken : {
          type : String
     }

} ,{timestamps : true}); //timestamps will create createdAt and updatedAt fields automatically  

userSchema.pre("save" , async function (next) {
     //isko lgane se hum check kr payege ki password modify hua hai ya nhi
     if(!this.isModified("password"))  return next();
     //hum data ke save hone se pehle password ko hash kr denge
     this.password = bcrypt.hash(this.password , 10)
     
     //jab bhi data save hoga to password dubara hash ho jayega
    
});

userSchema.methods.isPasswordCorrect = async function (password){
     return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
     //we will use jwt to generate token
     return jwt.sign(
          {
               _id : this._id,
               email : this.email,
               username : this.username,
               fullname : this.fullname,
          },
          process.env.ACCESS_TOKEN_SECRET,{
               expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
          }
     ) //it generates the token
}
userSchema.methods.generateRefreshToken = function(){
      return jwt.sign(
          {
               _id : this._id,
               //refresh token me hm jyada data nhi rkhte
             
          },
          process.env.REFRESH_TOKEN_SECRET,{
               expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
          }
     ) //it generates the token

}

export const User = mongoose.model("User" , userSchema)