// This file contains the function for exporting a state tax file to the user, based on information from the database
// The function takes a list of state initial strings, and based on those, it will populate the yaml and write it out to a file path
// In the future, it will send this file back to the frontend(?) and download it for the user.

const yaml = require('js-yaml');
const StateTax = require('./models/StateTax');
const TaxBracket = require('./models/TaxBracket');

async function exportStateTaxBracketsToYaml(stateTaxFile) {
  try {
    // fetch the StateTax documents referenced in the StateTaxFile
    const stateTaxData = await StateTax.find({ _id: { $in: stateTaxFile.stateTaxes } })
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

    // convert the data to YAML
    const stateTaxYaml = yaml.dump(simplifiedData);

    // return the YAML data
    return stateTaxYaml;
  } catch (error) {
    console.error('Error exporting state tax brackets:', error);
    throw error; 
  }
}

module.exports = exportStateTaxBracketsToYaml;