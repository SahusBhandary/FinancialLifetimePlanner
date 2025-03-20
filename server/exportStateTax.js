// This file contains the function for exporting a state tax file to the user, based on information from the database
// The function takes a list of state initial strings, and based on those, it will populate the yaml and write it out to a file path
// In the future, it will send this file back to the frontend(?) and download it for the user.

const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs = require('fs');
const StateTax = require('./models/StateTax'); 
const TaxBracket = require('./models/TaxBracket'); 

async function exportStateTaxBracketsToYaml(statesToExport) {
  try {
    // connect to database (FOR TESTING)
    await mongoose.connect('mongodb://localhost:27017/flp');

    // fetch the brackets and populate it
    const stateTaxData = await StateTax.find({ state: { $in: statesToExport } })
      .populate('singleIncomeTaxBrackets marriedIncomeTaxBrackets')
      .exec();

    // simplify the data so that it is readable
    const simplifiedData = stateTaxData.map(state => ({
      state: state.state,
      singleIncomeTaxBrackets: state.singleIncomeTaxBrackets.map(bracket => ({
        rate: bracket.rate,
        lower: bracket.lower,
        upper: bracket.upper,
        fixedAmount: bracket.fixedAmount,
      })),
      marriedIncomeTaxBrackets: state.marriedIncomeTaxBrackets.map(bracket => ({
        rate: bracket.rate,
        lower: bracket.lower,
        upper: bracket.upper,
        fixedAmount: bracket.fixedAmount,
      })),
    }));

    // dump to yaml
    const stateTaxYaml = yaml.dump(simplifiedData);

    // write to a filepath (TESTING)
    fs.writeFileSync('stateTaxBrackets.yaml', stateTaxYaml);

    console.log('State tax brackets exported successfully.');

  } catch (error) {
    console.error('Error exporting state tax brackets:', error);
  } finally {
    // close connection for TESTING
    await mongoose.connection.close();
  }
}

// testing with states
const statesToExport = ['NY', 'CT', 'NJ'];
exportStateTaxBracketsToYaml(statesToExport);