import multer from "multer";

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null , "./public/temp"); //folder name jaha file save krni hai
    },
    filename : function(req, file, cb){
        
        cb(null , file.originalname); //unique filename banane ke liye
    }   
});


export const upload = multer({ storage: storage });

