const mongoose = require("mongoose");

const connectdb = () =>(
    mongoose.connect(process.env.MONGO_URI)
).then(()=>console.log("Mongodb connected"))
.catch((e)=>console.log(e));

module.exports = connectdb;