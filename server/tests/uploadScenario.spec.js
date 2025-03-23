const { test, expect } = require('@playwright/test');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const UserModel = require('../models/User'); 
const ScenarioModel = require('../models/Scenario'); 
const InvestmentTypeModel = require('../models/InvestmentType'); 
const InvestmentModel = require('../models/Investment'); // Adjust the path as needed
const EventSeriesModel = require('../models/EventSeries'); // Adjust the path as needed

test.beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/flp');
});

test.afterAll(async () => {
    await InvestmentModel.deleteMany({}); 
    await InvestmentTypeModel.deleteMany({}); 
    await EventSeriesModel.deleteMany({}); 
    await ScenarioModel.deleteMany({}); 
    await UserModel.deleteMany({}); 
    await mongoose.connection.close();
});

let testUser;

// Create a test user and clean up the database before each test
test.beforeEach(async () => {
  await ScenarioModel.deleteMany({});
  await InvestmentTypeModel.deleteMany({});
  await InvestmentModel.deleteMany({});
  await EventSeriesModel.deleteMany({});
  await UserModel.deleteMany({});

  // Create a test user
  testUser = new UserModel({
    name: 'Test User 2',
    email: 'testuser2@example.com',
    googleID: '123456',
    stateOfResidence: 'NY',
  });
  await testUser.save();
});

// Test to import a scenario from the file path specified (would be a real button on our frontend)
test('Import Scenario', async ({ request }) => {
  const yamlFilePath = path.join(__dirname, 'test-scenario.yaml');

  // read yaml
  const yamlFileContent = fs.readFileSync(yamlFilePath, 'utf8');

  // create form object
  const formData = {
    userId: testUser._id.toString(), 
    scenarioFile: {
      name: 'test-scenario.yaml',
      mimeType: 'application/yaml',
      buffer: Buffer.from(yamlFileContent),
    },
  };

  // send request to import-scenario
  const response = await request.post('http://localhost:8000/import-scenario', {
    multipart: formData,
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();
  expect(responseBody.message).toBe('Scenario imported successfully');

  // verify the scenario was saved 
  const savedScenario = await ScenarioModel.findOne({ name: 'Retirement Planning Scenario' });
  expect(savedScenario).toBeTruthy();
  expect(savedScenario.name).toBe('Retirement Planning Scenario');
  expect(savedScenario.maritalStatus).toBe('couple');
  expect(savedScenario.financialGoal).toBe(10000);

  // verify the scenario was added to the scenario array of user
  const user = await UserModel.findById(testUser._id).populate('scenarios');
  expect(user).toBeTruthy();
  expect(user.scenarios[0]._id.toString())===(savedScenario._id.toString());

  // verify investment types were saved 
  const savedInvestmentTypes = await InvestmentTypeModel.find({});
  expect(savedInvestmentTypes.length).toBe(3);
  expect(savedInvestmentTypes.map((it) => it.name)).toEqual(
    expect.arrayContaining(['cash', 'S&P 500', 'tax-exempt bonds'])
  );
  expect(user.investmentTypes.map((id) => id.toString())).toEqual(
    expect.arrayContaining(savedInvestmentTypes.map((it) => it._id.toString()))
  );

  // verify investments were saved 
  const savedInvestments = await InvestmentModel.find({});
  expect(savedInvestments.length).toBe(5);
  expect(savedInvestments.map((inv) => inv.id)).toEqual(
    expect.arrayContaining([
      'cash non-retirement',
      'S&P 500 non-retirement',
      'tax-exempt bonds non-retirement',
      'S&P 500 pre-tax',
      'S&P 500 after-tax',
    ])
  );
  expect(user.investments.map((inv) => inv.toString())).toEqual(
    expect.arrayContaining(savedInvestments.map((inv) => inv._id.toString()))
  );

  // verify event series were saved 
  const savedEventSeries = await EventSeriesModel.find({});
  expect(savedEventSeries.length).toBe(6);
  expect(savedEventSeries.map((es) => es.name)).toEqual(
    expect.arrayContaining([
      'salary',
      'food',
      'vacation',
      'streaming services',
      'my investments',
      'rebalance',
    ])
  );
  expect(user.events.map((es) => es.toString())).toEqual(
    expect.arrayContaining(savedEventSeries.map((es) => es._id.toString()))
  );
});