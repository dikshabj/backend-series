import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async(req , res) => {
    console.log("🔥🔥 FILES AAYI KYA?:", req.files);
   /*  res.status(200).json({
        message : "Hare Krishna!"
    }) */
   // ab hum register user krne ke liye logic likhenge..
   // get user details from frontend(or from postman)
   // validation bhi lgani pdegi-not empty(sb empty to ni)
   // check if user already exists : check from email or username
   // check for images, check for avatar
   // upload them to cloudinary
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation 
   // return response or error
   // req.body se hm data extract kr skte hai jo frontend se aaya hoga
   
   // hum destructure krenge sbhi fields ko req.body se
   // ab ek bar console.log krwake dekhte h
  
   // abhi tk hum bs data handle kr parhe h jo json format me ayega
   // file handling bhi sikhni hi pdegi hume
   // ab humne jo multer ka middleware bnaya tha usme upload ko import krenge routes me
   
   //ab like hum validations check krege user ki details lene ke bad to 
   //apierror ko import kr lenge
   //or uska use krke fir hum validations check krlege

   //ab hum check krenge if user already exist or not
   //uske liye hum user model ko import krenge
   //user model directly contact kr skta h mongodb me jakr isiliye hm uspe method use krege
   const {fullname , username, email , password} = req.body;
   console.log("email: " , email);

   /* if(fullname === ""){
    throw new ApiError(400 , "fullname is required")
    } */
   // to look more professional you can either make an array of all fields in if else
   //validation
    if(
        [fullname , email , username , password].some(
            (field)=> field?.trim() === "")
    ){
       throw new ApiError(400, "All fields are required")
    }
    
    //already exist
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser){
        throw new ApiError(409, "Username or Email already exist!");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log(req.files?.avatar[0]);

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File Required");
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   

    if(!avatar){
        throw new ApiError(400, "Avatar File is required")

    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user!")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser , "User registered successfully" )
    )
   


   

//function ends here..
});


export const loginUser = asyncHandler(async(req , res) => {
           //req body se data le aao  
           // username and email se login krwao
           // find the user
           // password check
           // access and refresh token
           // send the tokens in coookies
           

           const {email , username , password} = req.body;

           if(!username || !email){
            throw new ApiError(400,"username or password is required!" )
           }

           const user = await User.findOne({
            $or: [{username} , {email}]
           })

           if(!user){
            throw new ApiError(404, "User doesnt exist!")

           }


           const isPasswordValid = await user.isPasswordCorrect(password)

           if(!isPasswordValid){
            throw new ApiError(401, "User does not exist")
           }
             
           const{accessToken , refreshToken} = await generateRefreshAndAccessToken(user._id)
           //access and refresh token
           //bar bar use hoga isiliye ek method hi bna denge

           //now we will send these in cookies
           //for that we have to remove some sensitive fields :
           //humne jo upr user refrence liya hai to vo use hm sidha use krege to
           //usme refresh token nhi ayega vo khali ayega to ab hm do kam kr skte h
           //ya to db me wapis query send krege (jo ki kahi na kahi expensive process ho skti h)
           //const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

           //br br db me call krege to use hzaro fields m se data dekhna pdega isiliye hum
           //object me se hi jo fields aage req ni unhe hta denge

           //we converted the existing 'user' document to a plain js object
           //now we can modify it safely
           const loggedInUser = user.toObject();

           delete loggedInUser.password;
           delete loggedInUser.refreshToken;

           //now we will send cookies : 
           //isme kuch optioons rkhege jiska mtlb h ki ye bs server se hi modifiable hongi
           //frontend se nahi
           const options = {
            httpOnly : true,
            secure : true
           }

           return res
           .status(200)
           .cookie("accessToken" , accessToken , options)
           .cookie("refreshToken" , refreshToken , options)
           .json(
            new ApiResponse(200, {
                user : loggedInUser, accessToken, refreshToken
            }, "User Logged In Sucessfully")
           )

           //function ends here
})

//generate and refresh token
const generateRefreshAndAccessToken = async(userId)=>{
    try {
       const user = await User.findById(userId) 
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false})

       return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


export const logOutUser = asyncHandler(async(req , res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken : undefined}
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200) ,{},  "User Logged Out Successfully" )
})