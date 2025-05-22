const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are necessary");
    }
    
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    
    const user = await User.create({
        username,
        email,
        password: hashed,
    });
    
    if (user) {
        res.status(201).json({ 
            _id: user.id, 
            email: user.email,
            message: "User registered successfully" 
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    // Remove this line - it's unreachable code after the if/else
    // res.json({message:"register the user"});
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    
    const user = await User.findOne({ email });
    
    // Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" } // Changed from 15m to 7 days
        );
        
        // Send both 'token' and 'accessToken' for compatibility
        res.status(200).json({ 
            token: accessToken,        // For your frontend
            accessToken: accessToken,  // For consistency
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };