const mongoose = require('mongoose');

const TaxBracketSchema = new mongoose.Schema({
  rate: { type: mongoose.Schema.Types.Mixed, required: true },
  lower: { type: Number, required: true },
  upper: { type: mongoose.Schema.Types.Mixed, required: true },
  fixedAmount: { type: Number }, 
});

const TaxBracket = mongoose.model('TaxBracket', TaxBracketSchema);
module.exports = TaxBracket;
