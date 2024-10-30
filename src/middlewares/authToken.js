const {User} = require("../models/user");
const jwt = require("jsonwebtoken");
//const mongoose= require("mongoose");

userAuth=async function (req, res,next){
    try{
        const cookies= req.cookies;
      const{token}=cookies;
      if(!token){
        throw new Error("Invalid token");
      }
      const decodedMessage=await jwt.verify(token,"DevTinder2890");
      const {_id}= decodedMessage; 
      
      const user = await User.findById(_id);
      if(!user){
        throw new Error("User does not exist");
      }
      req.user=user;
      next();
      
      //res.send(user);
      
    }catch(err){
      res.status(400).send("Error :"+err.message);
  
    }
}
module.exports=userAuth;