const yaml = require('js-yaml');
const mongoose = require('mongoose');

// import schemas needed to export
const Scenario = require('./models/Scenario');
const InvestmentType = require('./models/InvestmentType'); 
const Investment = require('./models/Investment'); 
const EventSeries = require('./models/EventSeries'); 
const User = require('./models/User'); 


// function to import yaml files for scenarios
async function importScenarioFromYAML(fileContent, userId) {
  try {
    // parse content
    const data = yaml.load(fileContent);

    // validate investment types
    const investmentTypes = await Promise.all(
      data.investmentTypes.map(async (it) => {
        const investmentType = new InvestmentType(it);
        await investmentType.save();
        return investmentType;
      })
    );

    // map items into their ids
    const investmentTypeMap = investmentTypes.reduce((map, it) => {
      map[it.name] = it._id;
      return map;
    }, {});

    // validate investments
    const investments = await Promise.all(
      data.investments.map(async (inv) => {
        // replacing the string name with their correlated id
        const investment = new Investment({
          ...inv,
          investmentType: investmentTypeMap[inv.investmentType], // map to ObjectId
        });
        await investment.save();
        return investment;
      })
    );

    // map investment ids to their object ids
    const investmentMap = investments.reduce((map, inv) => {
      map[inv.id] = inv._id;
      return map;
    }, {});

    // validate event series
    const eventSeries = await Promise.all(
      data.eventSeries.map(async (es) => {
        const event = new EventSeries(es);
        await event.save();
        return event;
      })
    );

    // create the scenario to add to db
    const scenario = new Scenario({
      name: data.name,
      maritalStatus: data.maritalStatus,
      birthYears: data.birthYears,
      lifeExpectancy: data.lifeExpectancy,
      investmentTypes: investmentTypes.map((it) => it._id),
      investments: investments.map((inv) => inv._id),
      eventSeries: eventSeries.map((es) => es._id),
      inflationAssumption: data.inflationAssumption,
      afterTaxContributionLimit: data.afterTaxContributionLimit,
      spendingStrategy: data.spendingStrategy,
      expenseWithdrawalStrategy: data.expenseWithdrawalStrategy.map((id) => investmentMap[id]), 
      RMDStrategy: data.RMDStrategy.map((id) => investmentMap[id]), 
      RothConversionOpt: data.RothConversionOpt,
      RothConversionStart: data.RothConversionStart,
      RothConversionEnd: data.RothConversionEnd,
      RothConversionStrategy: data.RothConversionStrategy.map((id) => investmentMap[id]),
      financialGoal: data.financialGoal,
      residenceState: data.residenceState,
    });

    // save the scenario onto the database
    await scenario.save();

    // find the user object
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // add scenario onto the user
    user.scenarios.push(scenario._id);

    // add investment types onto the user
    investmentTypes.forEach((it) => {
      if (!user.investmentTypes.includes(it._id)) {
        user.investmentTypes.push(it._id);
      }
    });

    // add event series onto the user
    eventSeries.forEach((es) => {
      if (!user.events.includes(es._id)) {
        user.events.push(es._id);
      }
    });

    // save the user
    await user.save();

    console.log('Scenario imported successfully:', scenario);
    return scenario; //return imported scenario
  } catch (error) {
    console.error('Error importing scenario:', error);
    throw error; //throw an error
  }
}

module.exports = importScenarioFromYAML;