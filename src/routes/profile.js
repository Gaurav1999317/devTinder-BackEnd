const express= require("express");
const userAuth= require("../middlewares/authToken")
const profileRouter= express.Router();
const {validateEditProfileData}= require("../utils/validation")


profileRouter.get("/profile/view",userAuth,async (req,res)=>{
  
    res.send(req.user);
  });
  profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
      if(!validateEditProfileData(req)){
        throw new Error("invalid edit request!!")
      }
      const loggedInUser= req.user;
      Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
      await loggedInUser.save();
      res.json({message:"data edited sucessfully",
        data:loggedInUser
      });
    }catch(err){
      res.status(400).send("Error :"+err.message);
    }

  })
  module.exports={
    profileRouter
  };