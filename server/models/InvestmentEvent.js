const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({
  investment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  allocation_percentage: { type: Number, required: true, min: 0, max: 100 }
});

const InvestmentEventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  start_year: { type: Number, required: true },
  duration: { type: Number, required: true },
  asset_allocation: {
    type: { type: String, enum: ['fixed', 'dynamic'], required: true },
    allocations: [AllocationSchema]
  },
  max_cash: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event_type: { type: String, enum: ['investment'], required: true }
}, { timestamps: true });

const InvestmentEvent = mongoose.model('InvestmentEvent', InvestmentEventSchema);
module.exports = InvestmentEvent;
