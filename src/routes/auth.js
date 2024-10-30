const express= require("express");
const authRouter=express.Router();
const {validatorSignUp,findUser,validatePassword}= require("../utils/validation");
const bcrypt= require("bcrypt");
const {User}=require("../models/user");



authRouter.post("/signup",async(req,res)=>{
    

    try{
        validatorSignUp(req);
      const {firstName,lastName, gender,email,password}= req.body;
      
     const passwordHash=   await bcrypt.hash(password,10,);
        await User({
          firstName,
          lastName,
          gender,
          email,
          password:passwordHash
        }).save();
    res.send("data saved successfully !!");
    }catch(err){
        res.status(400).send("Error:"+err.message)

    }
}
);
authRouter.post("/login",async(req,res)=>{
    try{
      const{email,password}=req.body;
      const user = await User.findOne({email:email});
      if(!user){
        throw new Error("invalid creds");
      }
      const isPasswordCorrect= await user.validatePassword(password);
      if(isPasswordCorrect){
        //create a cookie with json web token
        const token = await  user.getJWT();
        res.cookie("token",token);
  
        res.send("Login Successfull!!");
      }
      else{
        throw new Error("invalid creds");
      }
      
    }catch(err){
      res.status(400).send("Error :"+err.message);
    }
  
  });
  authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
      expires: new Date(Date.now())
    }).send("logged out !!");
    
  });
  authRouter.patch("/forgotPassword",findUser,async(req,res)=>{
    try{
       const  user=req.user;
      // if(Object.keys(user).length===0){
      //   throw new Error("User does not exist");
      // } 
       
      
      if(!validatePassword(req))
      {
        throw new Error("not a Strong Password !!");
      }
      
      const hashPassword=await bcrypt.hash(req.body.password,10);
     
     console.log(user);
      user.password=hashPassword;
     //console.log(typeof user.save)
      await user.save();
      
      res.send("password Updated successfully!!");
    }catch(err){
      res.status(400).send("Error: "+err.message);//$2b$10$W7RQyGqVdI4NE22LzZBjXeRLj3XtXtRRxhqcr/2dyF3ECaSdnfiga
    }

  });
  
  module.exports={
    authRouter
  }