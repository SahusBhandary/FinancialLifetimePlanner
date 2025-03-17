const mongoose = require('mongoose');

const RebalanceInvestmentSchema = new mongoose.Schema({
  investment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  allocation_percentage: { type: Number, required: true, min: 0, max: 100 }
});

const RebalanceEventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  start_year: { type: Number, required: true },
  duration: { type: Number, required: true },
  investments: [RebalanceInvestmentSchema],
  event_type: { type: String, enum: ['rebalance'], required: true }
}, { timestamps: true });

const RebalanceEvent = mongoose.model('RebalanceEvent', RebalanceEventSchema);
module.exports = RebalanceEvent;