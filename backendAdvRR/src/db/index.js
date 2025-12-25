import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB = async () => {
  try {
    const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\n Mongodb connected !! Host: ${connectionInstance.connection.host} \n`);
    
  } catch (error) {
    console.log("Error while connecting to MongoDB", error);
    process.exit(1); // Exit the process with failure

    
  }    

};
export default connectToDB;