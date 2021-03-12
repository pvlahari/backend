
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = User =  mongoose.model('users', UserSchema);