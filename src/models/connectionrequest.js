const mongoose= require("mongoose");
const connectionRequestSchema= mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["interested","ignored","accepted","rejected"],
        message:"${value} is not appropriate"
    }
});
connectionRequestSchema.pre("save",function(next){
    const connectionRequest= this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
       throw new Error("cant send request to yourself");
    }
    next();

});
const ConnectionRequest= new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest;