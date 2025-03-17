const mongoose = require('mongoose');

const TaxBracketSchema = new mongoose.Schema({
  minIncome: { type: Number, required: true },
  maxIncome: { type: Number, required: true },
  rate: { type: Number, required: true }
});

const FederalTaxSchema = new mongoose.Schema({
  federalIncomeTaxBrackets: [TaxBracketSchema],
  standardDeductions: {
    single: { type: Number, required: true },
    marriedFilingJointly: { type: Number, required: true },
    headOfHousehold: { type: Number, required: true }
  },
  capitalGainsTaxRates: [TaxBracketSchema]
}, { timestamps: true });

const FederalTax = mongoose.model('FederalTax', FederalTaxSchema);
module.exports = FederalTax;
