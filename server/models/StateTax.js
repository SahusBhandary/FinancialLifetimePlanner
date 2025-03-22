const mongoose = require('mongoose');

const StateTaxSchema = new mongoose.Schema({
  state: { type: String, required: true, trim: true },
  singleIncomeTaxBrackets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }],
  marriedIncomeTaxBrackets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }]

}, { timestamps: true});

const StateTax = mongoose.model('StateTax', StateTaxSchema);
module.exports = StateTax;