const express = require('express'); 
const { userAuth } = require('../middlewares/auth.js');
const { validateEditProfileData } = require("../utils/validation.js");



const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try{
        
        const user = req.user;
        res.send(user);

    }catch(err){
        res.status(500).send("Error fetching profile"+ err);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try{
        if(!validateEditProfileData(req)){
            return  res.status(400).send("Invalid fields in request body");
        }

        const loggedInUser = req.user; 

        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({ 
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser });


    } catch(err){
        return res.status(500).send("Error validating profile edit data"+ err);
    };

});

module.exports = profileRouter;