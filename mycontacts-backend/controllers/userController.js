const asyncHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
//@desc register a user
//@route POST /api/users/register
//@access public

const registerUser=asyncHandler(async(req,res) =>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("all fiels are necessary");

        
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered!");
    }

    //hash pwd
    const hashed=await bcrypt.hash(password,10);
    console.log(hashed);
    const user=await User.create({
        username,
        email,
        password:hashed,

    });
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }
    else{
        res.status(400);
        throw new Error("user data is not valis");
    }
    res.json({message:"register the user"});

});

//@desc login a user
//@route POST /api/users/login
//@access public

const loginUser=asyncHandler(async(req,res) =>{

    const {email,password}=req.body;
    if(!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory");

    }
    const user=await User.findOne({email});
    //compare pwd with hashed
    if(user&&(await bcrypt.compare(password,user.password))){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    );
        res.status(200).json({accessToken});


    }
    else{
        res.status(401);
        throw new Error("email or pwd is not valid")
    }
    
});

//@desc Current user info
//@route POST /api/users/current
//@access private

const currentUser=asyncHandler(async(req,res) =>{
    res.json(req.user);

});
module.exports={registerUser,loginUser,currentUser};