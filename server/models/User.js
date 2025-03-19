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
    required: true,
    min: 0
  },
  stateOfResidence: {
    type: String,
    required: true,
    trim: true
  },
  investmentTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentType' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventSeries' }],
},
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
