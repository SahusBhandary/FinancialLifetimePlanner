const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    required: false,
    min: 0
  },
  stateOfResidence: {
    type: String,
    required: false,
    trim: true
  },
  googleID: {
    type: String,
    required: true,
  }
},
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
