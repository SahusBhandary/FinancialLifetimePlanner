const mongoose = require('mongoose');

const TaxBracketSchema = new mongoose.Schema({
  rate: { type: Number, required: true },
  lower: { type: Number, required: true },
  upper: { type: mongoose.Schema.Types.Mixed, required: true }  // Allows both Number and String
});

const TaxBracket = mongoose.model('TaxBracket', TaxBracketSchema);
module.exports = TaxBracket;
