const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentSchema = new mongoose.Schema({
    investmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentType', required: true },
    value: { type: Number, required: true },
    taxStatus: { type: String, required: true },
    id: { type: String, required: true}
  }, { timestamps: true });

module.exports = mongoose.model('Investment', InvestmentSchema);
