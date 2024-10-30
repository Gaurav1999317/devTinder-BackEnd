const express= require("express");
const requestRouter= express.Router();
const userAuth= require("../middlewares/authToken");
const {User} = require("../models/user")
const ConnectionRequest= require("../models/connectionrequest");


requestRouter.post("/request/send/:status/:userId",userAuth,async(req,res)=>{
    try{
        const toUserId=req.params.userId;
        const status= req.params.status;
        const fromUserId = req.user._id;
        allowedStatus=["interested","ignored"];
       
        if(!allowedStatus.includes(status)){
            throw new Error("status is not valid");
        }
        
        const toUser = await User.findById(toUserId);
        
        if(!toUser){
            throw new Error("User does not exist!");
        }
        const connectionRequestExist= await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},//cehcking for the cases where i have sent the req already to the user or the other has already sent me the req
                {toUserId,fromUserId}
            ]
        }) ;
        if(connectionRequestExist){
            throw new Error("request already present!!");
        }
        const connectionRequest = ConnectionRequest(
            {
                
                fromUserId,
                toUserId,
                status

            }
        );
        const data=await connectionRequest.save();
        res.json({
            message:"request sent succesfully!",
            data
        })

    }catch(err){
        res.status(400).send("Error : "+err.message);

    }
});
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const {status,requestId}=req.params;
    const loggedInUser=req.user;
    //console.log(status)
    const allowedStatus=["accepted","ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"status not allowed"});
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"  
    }) 
    if(!connectionRequest){
        return res.status(400).json({message:"not request found!!"});
    }
    connectionRequest.status=status;
    await connectionRequest.save();
    res.json({
        message:"request"+status,
        connectionRequest
    })
    }catch(err){

        res.status(400).send("Error : "+err.message);
    }
});
module.exports=requestRouter;