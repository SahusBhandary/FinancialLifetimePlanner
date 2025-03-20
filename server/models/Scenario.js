const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    maritalStatus: { type: String, enum: ['couple', 'individual'], required: true },
    birthYears: [{ type: Number, required: true }], // array with length 1 or 2
    lifeExpectancy: [{
      type: { type: String, enum: ['fixed', 'normal', 'uniform', 'GBM'], required: true },
      value: { type: Number }, // for 'fixed'
      mean: { type: Number },  // for 'normal'
      stdev: { type: Number }, // for 'normal'
      lower: { type: Number }, // for 'uniform'
      upper: { type: Number }, // for 'uniform'
      mu: { type: Number },    // for 'GBM'
      sigma: { type: Number }  // for 'GBM'
    }],
    investmentTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentType' }],
    investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    eventSeries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventSeries' }],
    inflationAssumption: {
      type: { type: String, enum: ['fixed', 'normal', 'uniform', 'GBM'], required: true },
      value: { type: Number }
    },
    afterTaxContributionLimit: { type: Number },
    spendingStrategy: [{ type: String }], // list of discretionary expenses
    expenseWithdrawalStrategy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    RMDStrategy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    RothConversionOpt: { type: Boolean },
    RothConversionStart: { type: Number },
    RothConversionEnd: { type: Number },
    RothConversionStrategy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    financialGoal: { type: Number, required: true },
    residenceState: { type: String, required: true }
  }, { timestamps: true });

  const Scenario = mongoose.model('Scenario', ScenarioSchema);
  module.exports = Scenario;