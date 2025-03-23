const { test, expect } = require('@playwright/test');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User'); 
const StateTaxFile = require('../models/StateTaxFile');
const StateTax = require('../models/StateTax');
const TaxBracket = require('../models/TaxBracket');

test.beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/flp');
});

test.afterAll(async () => {
  await StateTaxFile.deleteMany({});
  await StateTax.deleteMany({})
  await TaxBracket.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

let testUser;

test.beforeEach(async () => {
  await StateTaxFile.deleteMany({});
  await User.deleteMany({});

  testUser = new User({
    name: 'Test User3',
    email: 'testuser3@example.com',
    googleID: '1234567',
    stateOfResidence: 'NY',
  });
  await testUser.save();
});

// test for whether a state tax file can be uploaded and linked to a user
test('Upload State Tax File', async ({ request }) => {
  const yamlFilePath = path.join(__dirname, 'test-state-tax.yaml');

  // read file
  const yamlFileContent = fs.readFileSync(yamlFilePath, 'utf8');

  // create form data 
  const formData = {
    userId: testUser._id.toString(),
    file: {
      name: 'test-state-tax.yaml',
      mimeType: 'application/yaml',
      buffer: Buffer.from(yamlFileContent),
    },
  };

  // send request for uploading
  const response = await request.post(`http://localhost:8000/uploadStateTax?userId=${testUser._id.toString()}`, {
    multipart: formData,
  });

  // verify response status
  expect(response.status()).toBe(200);

  // verify response message
  const responseBody = await response.json();
  expect(responseBody.success).toBe(true);
  expect(responseBody.message).toBe('State tax data imported successfully.');

  // verify the state tax file was saved 
  const savedFile = await StateTaxFile.findOne({});
  expect(savedFile).toBeTruthy();
  expect(savedFile.uploadDate).toBeTruthy();

  // verify that user has the new file
  const user = await User.findById(testUser._id).populate('uploadedFiles');
  expect(user).toBeTruthy();
  expect(user.uploadedFiles.length).toBe(1);
  expect(user.uploadedFiles[0]._id.toString()).toBe(savedFile._id.toString());

  // verify that there exists more than 0 state tax
  const stateTaxes = await StateTax.find({});
  expect(stateTaxes.length).toBeGreaterThan(0);
});

// test for whether a state tax file can be deleted and unlinked from a user
test('Delete State Tax File', async ({ request }) => {
  // Upload a file first
  const yamlFilePath = path.join(__dirname, 'test-state-tax.yaml');
  const yamlFileContent = fs.readFileSync(yamlFilePath, 'utf8');

  const formData = {
    userId: testUser._id.toString(),
    file: {
      name: 'test-state-tax.yaml',
      mimeType: 'application/yaml',
      buffer: Buffer.from(yamlFileContent),
    },
  };

  const uploadResponse = await request.post(`http://localhost:8000/uploadStateTax?userId=${testUser._id.toString()}`, {
    multipart: formData,
  });

  const savedFile = await StateTaxFile.findOne({});

  // send request for deleting
  const deleteResponse = await request.delete(`http://localhost:8000/user/deleteFile?userId=${testUser._id.toString()}&fileId=${savedFile._id.toString()}`);

  // verify response status
  expect(deleteResponse.status()).toBe(200);

  // verify response message
  const deleteResponseBody = await deleteResponse.json();
  expect(deleteResponseBody.success).toBe(true);
  expect(deleteResponseBody.message).toBe('File and associated data deleted successfully.');

  // verify the state tax file was deleted
  const deletedFile = await StateTaxFile.findById(savedFile._id);
  expect(deletedFile).toBeNull();

  // verify that user no longer has the file
  const user = await User.findById(testUser._id).populate('uploadedFiles');
  expect(user).toBeTruthy();
  expect(user.uploadedFiles.length).toBe(0);

  // verify that all associated state tax data was deleted
  const stateTaxes = await StateTax.find({ _id: { $in: savedFile.stateTaxes } });
  expect(stateTaxes.length).toBe(0);

  // verify that all associated tax brackets were deleted
  const taxBracketIds = stateTaxes.flatMap(stateTax => [
    ...stateTax.singleIncomeTaxBrackets,
    ...stateTax.marriedIncomeTaxBrackets,
  ]);
  const taxBrackets = await TaxBracket.find({ _id: { $in: taxBracketIds } });
  expect(taxBrackets.length).toBe(0);
});