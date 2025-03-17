const mongoose = require('mongoose');

const InvestmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  expense_ratio: { type: Number, required: true, min: 0 },
  expected_annual_returns: { type: Number, required: true },
  dividend_interest: { type: Number, required: true },
  taxability: {
    taxable: { type: Boolean, required: true },
    tax_exempt: { type: Boolean, required: true }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const InvestmentType = mongoose.model('InvestmentType', InvestmentTypeSchema);
module.exports = InvestmentType;