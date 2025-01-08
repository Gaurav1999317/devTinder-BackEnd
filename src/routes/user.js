const express= require("express");
const userRouter= express.Router();
const userAuth= require("../middlewares/authToken");
const ConnectionRequest = require("../models/connectionrequest");
const {User}= require("../models/user") 
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest= await
         ConnectionRequest.find(
            {toUserId:loggedInUser._id,status:"interested"}
        ).populate("fromUserId",
            "firstName lastName gender"
        );
        console
        res.json({message:"request pending",connectionRequest})
        

    }catch(err){
        res.statusCode(400).send("Error : "+err.message);
    }
});
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        loggedInUser=req.user;
        const connectionRequest= await ConnectionRequest.find(
            {
                        $or:[
                            {toUserId:loggedInUser._id,
                                status:"accepted" },
                                {
                                    fromUserId:loggedInUser._id,
                                    status:"accepted"
                                }

                        ]
            }).populate("fromUserId",
                "firstName lastName gender"
            ).populate("toUserId",
                "firstName lastName gender"
            );
        //     const connectionRequest2 = await ConnectionRequest.find({
        //         fromUserId:loggedInUser._id,
        //         status:"accepted"
        //    }).populate("toUserId","firstName lastName gender")
          // const data1 = connectionRequest2.map((row)=>row.toUserId);
            const data = connectionRequest.map((row)=>{
                if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                    return row.toUserId;
                }
                return row.fromUserId
            }
        );// will only show the data of the user which are connection of logged in user
            res.json({data:data});
    }catch(err){

        res.status(400).send({message:err.message});
    }
});
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        let limit=parseInt(req.query.limit)||10;//no of users to show on 1page
        limit=limit>50?50:limit;

        const page = parseInt(req.query.page)||1;//
        const skip= (page-1)*limit;//no of users to skip 

    const connectionRequest= await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
    }).select("fromUserId toUserId");
    const hideUsersFromFeed= new Set();
    connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });//to enter the id of the user which are connection, rejected, ignored, accepted from the logged In user
    const data = await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUsersFromFeed)}},//(nin:not in)checking whether the set have the values fo id present
        {_id:{$ne:loggedInUser._id}}//(ne:not equal to)checking for tthe user id 
      ]  
    }).select("firstName lastName gender age about skills").skip(skip).limit(limit);

    
res.json({data});
//     

    }catch(err){
        res.statusCode(400).send("Error: ",err.message)
    }

});
userRouter.get("/search/:userName",userAuth,async(req,res)=>{
   try{
    searchedUserName=req.params.userName;
    loggedInUser=req.user;
    const searchedUser= await User.find({
        firstName:searchedUserName
    });
    if(!searchedUser){
        throw new Error("user does not exist!!");
    }
    res.json({message:"User found",
        searchedUser
    });


   }catch(err){
    res.status(400).json({message:"Error "+err.message});
   }

});
module.exports= userRouter;
