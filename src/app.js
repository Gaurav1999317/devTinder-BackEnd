const express= require("express");

const app=express();//creating the server
const connectdb=require("./database/database");
//const {User}=require("./models/user")
const {profileRouter}=require("./routes/profile");
const {authRouter}= require("./routes/auth");
const cookieParser = require("cookie-parser");
const cors=require("cors");
require('dotenv').config()
//const bcrypt=require("bcrypt");
//const jwt= require("jsonwebtoken");
const requestRouter= require("./routes/request")
const userRouter= require("./routes/user")


connectdb().then(
    ()=>{
console.log()  
          console.log("Database connected")
            app.listen(7777);//listen to server
            console.log("listening to the server");
        
        
        
    }
).catch((err)=>{
    
        console.log("something went wrong"+err.message);
});

// app.use((req,res)=>{

//     res.send("hello!!");//
// });

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json());//convert json to js object
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);





// app.get("/test",async(req,res)=>{
//     const user = await User.find({firstName:"Anish"});
    

//   try{
//     res.send(user)
//     console.log("data fetched !!")
//   }catch(err){
//     res.status(401).send("something went wrong"+err.message);
//   }
// });
// app.patch("/test/:userId",async(req,res)=>{
//   const userId=req.params?.userId;
  
//   const data = req.body
//   try{
//     const Allowed_Updates=["password","firstName","lastName"];//field on which update is allowed
//     const isUpadateAllowed=Object.keys(data).every((k)=>Allowed_Updates.includes(k));// check for the very value whther tyhe field on which update is allowed
//    if(!isUpadateAllowed){
//     throw new Error("Update not allowed");
//    }
//     const user= await User.findByIdAndUpdate({_id:userId},data);
//    console.log(user);
//    res.send("User updated succesfully!!")
   

//   }catch(err){
//     res.send(err.message)
//   }

// })
