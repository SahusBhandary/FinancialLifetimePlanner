const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    relationship_status: {
      type: String,
      required: true
    },
    birth_year: {
      type: Number,
      required: true
    },
    life_expectancy: {
      type: Number,
      required: true
    },
    investments: [investmentSchema],
    income_events: [incomeEventSchema],
    investment_events: [investmentEventSchema],
    expense_events: [expenseEventSchema],
    rebalance_events: [rebalanceEventSchema],
    financial_goal: {
      type: Number,
      required: true
    },
    inflation: {
      type: Number,
      required: true
    },
    state_income_tax_rate: {
      type: Number,
      required: true
    },
    number_of_simulations: {
      type: Number,
      required: true
    },
    individual: {
      type: Boolean,
      required: true
    },
    married: {
      type: Boolean,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });
  
  module.exports = mongoose.model('Scenario', scenarioSchema);