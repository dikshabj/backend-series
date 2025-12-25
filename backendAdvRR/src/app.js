import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true,
    }
));


//json form me site se data aye to uski limit set krdi 16kb
app.use(express.json({
    limit : '16kb'
}))

//url se jo data aye uske liye
app.use(express.urlencoded({
    extended : true,
    limit : '16kb'
}))

//kuch bhi agr hm apne folder me rkhna chahte h store krke jise hm publicly access kr ske
app.use(express.static('public'));

//server se user ki cookies access krne ke liye or crud operations apply krne ke liye
app.use(cookieParser({
    //no options needed yet.
}));


//routes import 
import userRouter from './routes/user.routes.js';



//routes declaaration
app.use('/api/v1/users' , userRouter);
//http://localhost:4000/api/v1/users/register
export { app} ;