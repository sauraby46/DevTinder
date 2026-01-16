const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/users.js');



const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender"];

userRouter.get("/user/requests/recieved",
    userAuth,
    async (req, res) => {
        try {
            
            const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested"
            }).populate("fromUserId", ["firstName", "lastName", "age", "gender"]);

            res.status(200).json({
                message: "Data fetched successfully",
                data: connectionRequest
            });

        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender"])
          .populate("toUserId", ["firstName", "lastName", "age", "gender"]);

        const connections = connectionRequest.map((request) => {
            if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return request.toUserId;
            } else {
                return request.fromUserId;
            }
        });

        res.status(200).json({
            message: "Data fetched successfully",
            data: connections
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {

    try {
        
        const loggedInUser = req.user;

        const connecctionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        }).select("toUserId fromUserId");

        const hideUsersFromFeed = new Set();
        connecctionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed).concat([loggedInUser._id]) }
        }).select(USER_SAFE_DATA);


        res.status(200).json({
            message: "Data fetched successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

});

module.exports = userRouter;