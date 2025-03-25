const mongoose = require('mongoose');

const FederalTaxSchema = new mongoose.Schema({
  federalIncomeTaxBrackets: {
    single: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }],
    married: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }],
  },
  standardDeductions: {
    single: { type: Number, required: true },
    married: { type: Number, required: true },
  },
  capitalGainsTaxRates: {
    single: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }],
    married: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaxBracket' }],
  }
}, { timestamps: true });

const FederalTax = mongoose.model('FederalTax', FederalTaxSchema);
module.exports = FederalTax;
