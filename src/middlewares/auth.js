const jwt = require('jsonwebtoken');
const User = require('../models/users');

const userAuth = async (req, res, next) => {

    try {
            const { token } = req.cookies;
            if(!token){
                return  res.status(401).send("Please Login");
            }

            const decodedObj = await jwt.verify(token, "DEVTINDER_SECRET_KEY");

            const { _id } = decodedObj;

            const user = await User.findById(_id);
            if(!user){
                return res.status(401).send("Unauthorized: User not found");
            }
            req.user = user;

            next();
    } catch(err){
        res.status(401).send("Unauthorized: Invalid token" + err);
    }
};

module.exports = userAuth;