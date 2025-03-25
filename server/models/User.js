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
  },
  investmentTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentType' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventSeries' }],
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }],
  uploadedFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StateTaxFile' }],
  // uploadedStateTaxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StateTax' }]
  sharedScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }]

},
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
