const mongoose= require("mongoose");
const validate= require("validator");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        maxLength:50
    },
    lastName:{
        type:String,
        
        
    },
    gender:{
        type:String,
        required:true,
        lowercase:true,
        validate(value){

            if(!["male","female","other"].includes(value))
                {
                    throw new Error("invalid gender");
                    
                }
        }
    },
    email:{
        type:String,
        trim:true,
        index:true,
        unique:true,
        lowercase:true,
        required:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("not a Valid email "+value);
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        min:8,
        validate(value){
           if(!validate.isStrongPassword(value)){
            throw new Error("Not a strong password");
           } 
        }
    }

},
{
    timestamps:true
},



);
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"DevTinder2890");
    return token;
},
userSchema.methods.validatePassword=async function(password){
    const hashPassword=this.password;
    isPasswordValid=bcrypt.compare(password,hashPassword);
    return isPasswordValid;
};
const User= new mongoose.model("User",userSchema);
module.exports={
    User
};