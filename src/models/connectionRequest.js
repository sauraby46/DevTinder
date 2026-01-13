const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignore','interested', 'accepted', 'rejected'],
            message: `{VALUE} is not supported`,
        },
        required: true,
    },
}, 
{
     timestamps: true 
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        return next(new Error("Cannot send connection request to yourself"));
    }
    next();
});

const ConnectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;
