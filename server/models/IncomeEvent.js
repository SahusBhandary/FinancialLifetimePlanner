const mongoose = require('mongoose');

const IncomeEventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  start_year: { type: Number, required: true },
  duration: { type: Number, required: true },
  initial_amount: { type: Number, required: true },
  expected_annual_change: {
    value: { type: Number, required: true },
    type: { type: String, enum: ['fixed', 'percentage'], required: true }
  },
  inflation_adjustment: { type: Boolean, required: true },
  is_married_couple: { type: Boolean, required: true },
  marriage_split: {
    spouse: { type: Number, required: function() { return this.is_married_couple; } },
    user: { type: Number, required: function() { return this.is_married_couple; } }
  },
  is_wage: { type: Boolean, required: true },
  is_social_security: { type: Boolean, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  event_type: { type: String, enum: ['income'], required: true }
}, { timestamps: true });

const IncomeEvent = mongoose.model('IncomeEvent', IncomeEventSchema);
module.exports = IncomeEvent;