const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for distributions (fixed, normal, uniform)
const DistributionSchema = new Schema({
  type: { type: String, enum: ['fixed', 'normal', 'uniform'], required: true },
  value: { type: Number }, // for 'fixed'
  mean: { type: Number },  // for 'normal'
  stdev: { type: Number }, // for 'normal'
  lower: { type: Number }, // for 'uniform'
  upper: { type: Number }  // for 'uniform'
}, { _id: false }); 

const StartSchema = new Schema({
  type: { type: String, enum: ['fixed', 'normal', 'uniform', 'startWith', 'startAfter'], required: true },
  value: { type: Number }, // for 'fixed', 'normal', 'uniform'
  mean: { type: Number },  // for 'normal'
  stdev: { type: Number }, // for 'normal'
  lower: { type: Number }, // for 'uniform'
  upper: { type: Number }, // for 'uniform'
  eventSeries: { type: String } // for 'startWith' and 'startAfter'
}, { _id: false });

// Schema for event series
const EventSeriesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }, // optional
    start: { type: StartSchema, required: true },
    duration: { type: DistributionSchema, required: true },
    type: { type: String, enum: ['income', 'expense', 'invest', 'rebalance'], required: true },
    // fields for 'income' and 'expense' types
    initialAmount: {
      type: Number,
      required: function() { return this.type === 'income' || this.type === 'expense'; }
    },
    changeAmtOrPct: {
      type: String,
      enum: ['amount', 'percent'],
      required: function() { return this.type === 'income' || this.type === 'expense'; }
    },
    changeDistribution: {
      type: DistributionSchema,
      required: function() { return this.type === 'income' || this.type === 'expense'; }
    },
    inflationAdjusted: {
      type: Boolean,
      required: function() { return this.type === 'income' || this.type === 'expense'; }
    },
    userFraction: {
      type: Number,
      required: function() { return (this.type === 'income' || this.type === 'expense') && this.isMarriedCouple; }
    },
    // fields for 'income' type
    socialSecurity: {
      type: Boolean,
      required: function() { return this.type === 'income'; }
    },
    // fields for 'expense' type
    discretionary: {
      type: Boolean,
      required: function() { return this.type === 'expense'; }
    },
    // fields for 'invest' type
    assetAllocation: {
      type: Map,
      of: Number,
      required: function() { return this.type === 'invest' || this.type === 'rebalance'; }
    },
    glidePath: {
      type: Boolean,
      required: function() { return this.type === 'invest'; }
    },
    assetAllocation2: {
      type: Map,
      of: Number,
      required: function() { return this.type === 'invest' && this.glidePath === true; }
    },
    maxCash: {
      type: Number,
      required: function() { return this.type === 'invest'; }
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('EventSeries', EventSeriesSchema);