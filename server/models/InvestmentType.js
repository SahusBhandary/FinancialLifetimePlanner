const mongoose = require('mongoose');

const InvestmentTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    returnAmtOrPct: { type: String, enum: ['amount', 'percent'], required: true },
    returnDistribution: {
      type: { type: String, enum: ['fixed', 'normal', 'uniform', 'GBM'], required: true },
      value: { type: Number }, // for 'fixed'
      mean: { type: Number },  // for 'normal'
      stdev: { type: Number }, // for 'normal'
      lower: { type: Number }, // for 'uniform'
      upper: { type: Number }, // for 'uniform'
      mu: { type: Number },    // for 'GBM'
      sigma: { type: Number }  // for 'GBM'
    },
    expenseRatio: { type: Number, required: true },
    incomeAmtOrPct: { type: String, enum: ['amount', 'percent'], required: true },
    incomeDistribution: {
      type: { type: String, enum: ['fixed', 'normal', 'uniform', 'GBM'], required: true },
      value: { type: Number }, // for 'fixed'
      mean: { type: Number },  // for 'normal'
      stdev: { type: Number }, // for 'normal'
      lower: { type: Number }, // for 'uniform'
      upper: { type: Number }, // for 'uniform'
      mu: { type: Number },    // for 'GBM'
      sigma: { type: Number }  // for 'GBM'
    },
    taxability: { type: Boolean, required: true }
  }, { timestamps: true });

const InvestmentType = mongoose.model('InvestmentType', InvestmentTypeSchema);
module.exports = InvestmentType;