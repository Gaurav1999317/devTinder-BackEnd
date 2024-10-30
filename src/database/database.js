const mongoose= require("mongoose");
connectdb=async()=>{
    await mongoose.connect("mongodb+srv://bgaurav941:9Bw7fKvpaYtBUCqi@namastenode.ct1zk.mongodb.net/test");

}
module.exports=connectdb;