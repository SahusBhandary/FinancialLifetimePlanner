const mongoose = require('mongoose');

const TaxBracketSchema = new mongoose.Schema({
  minIncome: { type: Number, required: true },
  maxIncome: { type: Number, required: true },
  rate: { type: Number, required: true }
});

const StateTaxSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true, trim: true },
  filenum: { type: Number, required: true },
  incomeTaxBrackets: [TaxBracketSchema]
}, { timestamps: true });

const StateTax = mongoose.model('StateTax', StateTaxSchema);
module.exports = StateTax;