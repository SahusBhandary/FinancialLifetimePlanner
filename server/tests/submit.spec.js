const { test, expect } = require('@playwright/test');
const mongoose = require('mongoose');
const UserModel = require('../models/User'); // Adjust the path as needed
const InvestmentTypeModel = require('../models/InvestmentType'); // Adjust the path as needed
const InvestmentModel = require('../models/Investment'); // Adjust the path as needed
const EventSeriesModel = require('../models/EventSeries'); // Adjust the path as needed
const ScenarioModel = require('../models/Scenario'); // Adjust the path as needed

// Connect to the database before all tests
test.beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/flp');
});

// clean up
test.afterAll(async () => {
  await mongoose.connection.close();
});

// FAKE DATA IS AI GENERATED
// fake user 
let testUser;
let testInvestmentType;
test.beforeEach(async () => {
  // Create a test user
  testUser = new UserModel({
    name: 'Test User',
    email: 'testuser@example.com',
    googleID: '12345',
    stateOfResidence: 'NY',
  });
  await testUser.save();

  // fake investment type
  testInvestmentType = new InvestmentTypeModel({
    name: 'Stocks',
    description: 'Test investment type',
    returnAmtOrPct: 'amount',
    returnDistribution: {
      type: 'fixed',
      value: 0.05, // 5% fixed return
    },
    expenseRatio: 0.01, // 1% expense ratio
    incomeAmtOrPct: 'amount',
    incomeDistribution: {
      type: 'fixed',
      value: 0.02, // 2% fixed income
    },
    taxability: true, // Taxable investment
  });
  await testInvestmentType.save();
});

// clean up the test user, investment type, investments, events, and scenarios after each test
test.afterEach(async () => {
  await InvestmentModel.deleteMany({}); 
  await InvestmentTypeModel.deleteMany({}); 
  await EventSeriesModel.deleteMany({}); 
  await ScenarioModel.deleteMany({}); 
  await UserModel.deleteMany({}); 
});

// Test submit investment
test('Submit Investment', async ({ request }) => {
  const requestBody = {
    investmentTypeName: 'Stocks', 
    taxStatus: 'Taxable',
    initialValue: 10000,
    user: { googleID: '12345' }, 
  };

  // send req
  const response = await request.post('http://localhost:8000/submitInvestment', {
    data: requestBody,
  });

  // assert the response status is 200 (OK)
  expect(response.status()).toBe(200);

  // assert the response message
  const responseBody = await response.json();
  expect(responseBody.message).toBe('Investment successfully added to database.');

  // verify the investment was saved 
  const savedInvestment = await InvestmentModel.findOne({ id: 'Stocks Taxable' });
  expect(savedInvestment).toBeTruthy();
  expect(savedInvestment.value).toBe(10000);
  expect(savedInvestment.taxStatus).toBe('Taxable');
  expect(savedInvestment.investmentType.toString()).toBe(testInvestmentType._id.toString());

  // verify the investment was added to the investments array of user
  const user = await UserModel.findOne({ googleID: '12345' }).populate('investments');
  expect(user).toBeTruthy();
  expect(user.investments[0]._id.toString()).toEqual(savedInvestment._id.toString());
});

// Test for submitting event
test('Submit Event', async ({ request }) => {
  const eventData = {
    user: { googleID: '12345' }, 
    event: {
      name: 'Test Income Event',
      description: 'This is a test income event',
      start: {
        type: 'fixed',
        value: 2025,
      },
      duration: {
        type: 'fixed',
        value: 10, 
      },
      type: 'income', 
      initialAmount: 50000, 
      changeAmtOrPct: 'amount', 
      changeDistribution: {
        type: 'fixed',
        value: 1000, 
      },
      inflationAdjusted: true, 
      userFraction: 0.5, 
      socialSecurity: true,
    },
  };

  // send a POST request 
  const response = await request.post('http://localhost:8000/submitEvent', {
    data: eventData,
  });

  // assert the response status is 200 (OK)
  expect(response.status()).toBe(200);

  // assert the response message
  const responseBody = await response.json();
  expect(responseBody.message).toBe('Event submitted successfully!');

  // verify the event was saved 
  const savedEvent = await EventSeriesModel.findOne({ name: 'Test Income Event' });
  expect(savedEvent).toBeTruthy();
  expect(savedEvent.name).toBe('Test Income Event');
  expect(savedEvent.type).toBe('income');

  // verify the event was saved to the user event
  const user = await UserModel.findOne({ googleID: '12345' }).populate('events');
  expect(user).toBeTruthy();
  expect(user.events[0]._id.toString()).toEqual(savedEvent._id.toString());
});

// test for submitting a scenario
test('Submit Scenario', async ({ request }) => {
  // fake scenario
  const scenarioData = {
    user: { googleID: '12345' }, 
    scenario: {
      name: 'Test Scenario',
      maritalStatus: 'single',
      birthYears: [1990], 
      lifeExpectancy: [{
        type: 'fixed',
        value: 85,
      }],
      investmentTypes: [testInvestmentType._id], // reference to the test investment type
      investments: [], 
      eventSeries: [], 
      inflationAssumption: {
        type: 'fixed',
        value: 0.02, 
      },
      afterTaxContributionLimit: 6000,
      spendingStrategy: ['discretionary'], 
      expenseWithdrawalStrategy: [], 
      RMDStrategy: [], 
      RothConversionOpt: false,
      RothConversionStart: null,
      RothConversionEnd: null,
      RothConversionStrategy: [], 
      sharingSettings: 'private',
      financialGoal: 1000000, 
      residenceState: 'NY',
    },
  };

  // send a request for submitScenario
  const response = await request.post('http://localhost:8000/submitScenario', {
    data: scenarioData,
  });

  // assert the response status 
  expect(response.status()).toBe(200);

  // assert the response message
  const responseBody = await response.json();
  expect(responseBody.message).toBe('Scenario submitted successfully!');

  // verify the scenario was saved in the database
  const savedScenario = await ScenarioModel.findOne({ name: 'Test Scenario' });
  expect(savedScenario).toBeTruthy();
  expect(savedScenario.name).toBe('Test Scenario');
  expect(savedScenario.maritalStatus).toBe('single');
  expect(savedScenario.financialGoal).toBe(1000000);

  // verify the scenario was added to the scenario array of user
  const user = await UserModel.findOne({ googleID: '12345' }).populate('scenarios');
  expect(user).toBeTruthy();
  expect(user.scenarios[0]._id.toString()).toEqual(savedScenario._id.toString());
});

// Test for submitting investment type
test('Submit Investment Type', async ({ request }) => {
  // create the request body
  const requestBody = {
    form: {
      name: 'Bonds',
      description: 'Test investment type for bonds',
      returnAmtOrPct: 'amount',
      returnDistribution: {
        type: 'fixed',
        value: 0.03, 
      },
      expenseRatio: 0.005, 
      incomeAmtOrPct: 'amount',
      incomeDistribution: {
        type: 'fixed',
        value: 0.01, 
      },
      taxability: false, 
    },
    user: { googleID: '12345' }, 
  };

  // send a request to submitInvestmentType
  const response = await request.post('http://localhost:8000/submitInvestmentType', {
    data: requestBody,
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.message).toBe('Investment type successfully added to user.');

  // verify the investment type was saved in the database
  const savedInvestmentType = await InvestmentTypeModel.findOne({ name: 'Bonds' });
  expect(savedInvestmentType).toBeTruthy();
  expect(savedInvestmentType.description).toBe('Test investment type for bonds');
  expect(savedInvestmentType.taxability).toBe(false);

  // verify the investment type was added to the user's investmentTypes array
  const user = await UserModel.findOne({ googleID: '12345' }).populate('investmentTypes');
  expect(user).toBeTruthy();
  expect(user.investmentTypes[0]._id.toString()).toEqual(savedInvestmentType._id.toString());
});