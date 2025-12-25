
import dotenv from "dotenv";
import connectToDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});


connectToDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.log("Error while connecting to MongoDB", error);
    process.exit(1); // Exit the process with failure
});











//1st WAY TO CONNECT TO MONGODB

/* import express from "express";


const app = express();

( async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);


        app.on("error",(error)=>{
            console.log("Error while connecting to MongoDB", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
        throw error;
    }

});

 */