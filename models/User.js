const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    balance: {type:Number, required:false, default:100},
    password: String,
    admin: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;