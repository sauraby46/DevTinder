const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/users.js");

const authRouter = express.Router();



authRouter.post("/signup", async (req, res) => {
    
try{

    //Validation of data
    validateSignUpData(req);

    const{firstName, lastName, email, password} = req.body;
    //encrypt the password

    const passwordHash = await bcrypt.hash(password, 10);
    

    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash
    });

       await user.save();
       res.send("User signed up successfully");
    } catch(err){
       res.status(500).send("Error signing up user"+ err);
    }
   
});


authRouter.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            const token = await user.getJWT();


            res.cookie("token", token, { httpOnly: true });

            res.send("Login successful");
        } else {
            throw new Error("Invalid email or password");
        }
    } catch(err){
        res.status(400).send("Error logging in user"+ err);

    }
});

authRouter.post("/logout", async (req, res) => {

    res.cookie("token", null, { expires: new Date(Date.now()) });

    res.send("Logged out successfully");
});

module.exports = authRouter;