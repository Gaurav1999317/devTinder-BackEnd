const mongoose= require("mongoose");
connectdb=async()=>{
   console.log(process.env.DB_CONNECTION_STRING)
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

}
module.exports=connectdb;