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

      await newConnectionRequest.save();

      res.json({
        message: 
          `Connection request sent from user ${fromUserId} to user ${toUserId} with status ${status}`,
        data: newConnectionRequest
      });
    
    } catch (error) {
      res.status(500).send("Error sending connection request: " + error);
    }

}) ;

module.exports = requestRouter;