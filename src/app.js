const express = require('express');

const connectDB = require("./config/database.js");

const app = express();

const User = require("./models/users.js");



app.post("/signup", async (req, res) => { 
    const user = new User({
      firstName : "Saurab",
      lastName : "Yadav",
      email : "saurab@yadav.com",
      password : "saurab123",
      age : 21,
      gender : "male"
    });

    try{
       await user.save();
       res.send("User signed up successfully");
    } catch(err){
       res.status(500).send("Error signing up user", err);
    }
   
});


connectDB()
    .then(() => {

      app.listen(3000, () => {
        console.log('Server is running on port 3000');

    });

        console.log("Database connected successfully");    

    })
    .catch((err) => {
        console.error("Database connection error:", err);  
    });

