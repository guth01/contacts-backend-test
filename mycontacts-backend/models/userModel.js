const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"please add the user name"],

    },
    email:{
        type:String,
        required:[true,"please add the user mail"],
        unique:[true,"email address already taken"],
        

    },
    password:{
        type:String,
        required:[true,"please add the user pwd"],
    },
},
{
    timestamps:true,
});

module.exports=mongoose.model("User",userSchema);