//CURRENTLY TESTING FOR IMPORTING THE SCENARIO YAML FILE'S DATA -> DATABASE (GIVEN IN GOOGLE CLASSROOM)

const fs = require('fs');
const yaml = require('js-yaml');
const mongoose = require('mongoose');

// import schemas needed to export
const Scenario = require('./models/Scenario');
const InvestmentType = require('./models/InvestmentType'); 
const Investment = require('./models/Investment'); 
const EventSeries = require('./models/EventSeries'); 

// connect to mongo (testing purposes REMOVE WHEN USING IN LFP)
mongoose.connect('mongodb://localhost:27017/flp');

// imports yaml data
async function importScenarioFromYAML(filePath) {
    try {
      // get all the information
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents);
  
      // validate investment types
      const investmentTypes = await Promise.all(
        data.investmentTypes.map(async (it) => {
          const investmentType = new InvestmentType(it);
          await investmentType.save();
          return investmentType;
        })
      );
  
      // maps onto object id
      const investmentTypeMap = investmentTypes.reduce((map, it) => {
        map[it.name] = it._id;
        return map;
      }, {});
  
      // validate investments
      const investments = await Promise.all(
        data.investments.map(async (inv) => {
          // Replace the investmentType string with the corresponding ObjectId
          const investment = new Investment({
            ...inv,
            investmentType: investmentTypeMap[inv.investmentType], // Map to ObjectId
          });
          await investment.save();
          return investment;
        })
      );
  
      // maps onto object ids
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
  
      // create scenario 
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
  
      // save the scenario to db
      await scenario.save();
  
      //MESSAGES FOR ERROR LOGGING
      console.log('Scenario imported successfully:', scenario);
    } catch (error) {
      console.error('Error importing scenario:', error);
    } finally {
      //close connection REMOVE WHEN ACTUALLY USING FOR LFP
      mongoose.connection.close();
    }
  }
  

// FOR TESTING
// const filePath = './example_scenario.yaml'; //file path to export (this file is the one given by professor)
const filePath = './scenario-export-test.yaml' //testing to make sure exported file can be imported with no problem
importScenarioFromYAML(filePath);