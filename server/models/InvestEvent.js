const mongoose = require('mongoose');

const ExpenseEventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  start_year: { type: Number, required: true },
  duration: { type: Number, required: true },
  amount: { type: Number, required: true },
  is_discretionary: { type: Boolean, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event_type: { type: String, enum: ['expense'], required: true }
}, { timestamps: true });

const ExpenseEvent = mongoose.model('ExpenseEvent', ExpenseEventSchema);
module.exports = ExpenseEvent;