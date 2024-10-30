const validate=require("validator");
const { User } = require("../models/user");
validatorSignUp=(req)=>{
    if(req.body.firstName.length==0||req.body.lastName.length==0){
        throw new Error("pls fill the fields properly")
    }
    else if(req.body.firstName.length<4||req.body.firstName.length>50){
        throw new Error("first Name should be of 4-50 characters Long");
    }
    else if(!validate.isStrongPassword(req.body.password)){
        throw new Error("not strong password");
    }

    
}
const validateEditProfileData=(req)=>{
    const allowedUpdates=["firstName","lastName","gender"];
    const isUpdateAllowed=Object.keys(req.body).every((k)=>allowedUpdates.includes(k));//checks whether the update is allowed for every field
    return isUpdateAllowed;

}
 const findUser=async(req,res,next)=>{
    try{
    const {email}= req.body;
    if(!email){
        throw new Error("Email is require");
    }
    const user= await User.findOne({email:email});  
    if(!user){
        throw new Error("User not Found");
    }
     req.user= user;
    next();
}catch(err){
        res.status(400).send("Error : "+err.message);
    }
}
const validatePassword=(req)=>{
    const{password}= req.body;
    const isStrongPassword= validate.isStrongPassword(password);
    return isStrongPassword;
}

module.exports={
    validatorSignUp,
    validateEditProfileData,
    findUser,
    validatePassword
};