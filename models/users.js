const mongoose = require("../database");

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    token: String
});
const User = mongoose.model('User', userSchema);
module.exports = User;