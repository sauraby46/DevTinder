const express = require('express');
const User = require("../models/users.js");
const userAuth = require('../middlewares/auth.js');
const connectionRequest = require('../models/connectionRequest.js');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];
      if(!allowedStatus.includes(status)){
        return res
          .status(400)
          .json({ message: `Status ${status} is not supported` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "Recipient user not found" });
      }

      const exixtingConnectionRequest = await connectionRequest.findOne({
        $or: [
          {fromUserId, toUserId},
          {fromUserId: toUserId, toUserId: fromUserId}
        ]
      });

      if(exixtingConnectionRequest){
        return res
          .status(400)
          .json({ message: "Connection request already exists between these users" });
      }

      const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status
      });

      const data = await newConnectionRequest.save();

      res.json({
        message: 
          `Connection request sent from user ${fromUserId} to user ${toUserId} with status ${status}`,
        data,
      });
    
    } catch (error) {
      res.status(500).send("Error sending connection request: " + error);
    }

}) ;

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  
    try{

      const loggedInUser = req.user;
      const {status, requestId} = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res
          .status(400)
          .json({ message: `Status ${status} is not supported` });
      }

      const existingConnectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
      });

      if(!existingConnectionRequest){
        return res
          .status(404)
          .json({ message: "No pending connection request found to review" });
      }

      existingConnectionRequest.status = status;

      const data = await existingConnectionRequest.save();

      res.json({
        message: `Connection request ${requestId} has been ${status}`,
        data
      });

    }catch(error){
      res.status(500).send("Error reviewing connection request: " + error);
    }
});

module.exports = requestRouter;