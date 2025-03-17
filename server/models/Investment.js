const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentSchema = new mongoose.Schema({
    investmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentType', required: true },
    value: { type: Number, required: true },
    taxStatus: { type: String, enum: ['non-retirement', 'pre-tax', 'after-tax'], required: true },
    id: { type: String, required: true, unique: true }
  }, { timestamps: true });

module.exports = mongoose.model('Investment', InvestmentSchema);
