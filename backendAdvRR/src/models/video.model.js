import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new Schema({
    videoFile : {
        type : String, //cloudinary url
        required : [true , "Video file required"],

    },
    thumbnail : {
        type : String, //cloudinary url
        required : [true , "Thumbnail required"],

    },
    title : {
        type : String,
        required : [true , "Title is required"],

    },
    description : {
        type : String,
        required : true,
    },
    duration : {
        type : Number, //from cloudinary response
        required : true,
    },
    views : {
        type : Number,
        default : 0,
    },
    isPublished : {
        type : Boolean,
        default : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }

}, {timestamps : true});

//by this plugin hum aggregate queries me pagination use kr skte hai
videoSchema.plugin(mongooseAggregatePaginate); 




export const Video = mongoose.model("Video" , videoSchema)