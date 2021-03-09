const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  username: String,
  email: 
    { type: String,  unique: true },
  googleId: String,
  password: String
})

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;