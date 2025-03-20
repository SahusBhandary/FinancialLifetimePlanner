// This file contains the function for importing state tax yaml files. 
// The function takes a filepath as an input currently, but in the future it might be better to have it take an actual file (that the user uploads)
// Will be used when we have to allow the user to upload a yaml file with their state tax information

const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs = require('fs');
const StateTax = require('./models/StateTax'); 
const TaxBracket = require('./models/TaxBracket'); 

async function importStateTaxBracketsFromYaml(filepath) {
  try {
    // ADDED FOR UNIT TESTING
    await mongoose.connect('mongodb://localhost:27017/flp');

    // read file
    const fileContents = fs.readFileSync(filepath, 'utf8');
    const stateTaxData = yaml.load(fileContents);

    // interate over the data in the file
    for (const stateData of stateTaxData) {
      // insert tax brackets into their collections
      const singleBrackets = await TaxBracket.insertMany(stateData.singleIncomeTaxBrackets);
      const marriedBrackets = await TaxBracket.insertMany(stateData.marriedIncomeTaxBrackets);

      // creat the new document, with the brackets in
      const stateTax = new StateTax({
        state: stateData.state,
        singleIncomeTaxBrackets: singleBrackets.map(bracket => bracket._id),
        marriedIncomeTaxBrackets: marriedBrackets.map(bracket => bracket._id),
      });

      // save the new document
      await stateTax.save();
    }

    console.log('added state tax info successfully.');

  } catch (error) {
    console.error('error importing state tax brackets:', error);
  } finally {
    //close connection FOR TESTING
    await mongoose.connection.close();
  }
}

//FOR TESTING
let filepath = 'stateTaxBrackets.yaml'
importStateTaxBracketsFromYaml(filepath);