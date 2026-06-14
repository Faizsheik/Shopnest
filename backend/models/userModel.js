const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { 
        type: String, 
        sparse: true,  //allow multiple nulls
        unique: true,
        trim: true,
        lowercase: true
    },
    mobile: { 
        type: String, 
        sparse: true, 
        unique: true 
    },
    role: { 
        type: String, 
        default: 'user' 
    }
});

const userModel = mongoose.model('user',userSchema); // user is our variable
module.exports = userModel;