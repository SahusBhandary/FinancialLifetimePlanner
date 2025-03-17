const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  investment_type: {
    type: Schema.Types.ObjectId,
    ref: 'InvestmentType', 
    required: true
  },
  account_type: {
    type: String,
    enum: ['pre-tax retirement', 'post-tax retirement', 'taxable'], 
    required: true
  },
  valuation: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Investment', investmentSchema);
