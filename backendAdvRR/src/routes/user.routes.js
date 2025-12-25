import {Router} from "express";
import { registerUser , loginUser, logOutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        { 
            name: "coverImage",
            maxCount: 1
        }
        ]),
     registerUser
)


router.route('/login').post( loginUser)

//secured routes
router.route('/logout').post(  
    verifyJWT, 
    logOutUser)
    //ab humne middleware me jo next lgaya tha vo yahi kam krta h
    //vo next() krdega taki verify ke bd logout user kam kre


export default router;