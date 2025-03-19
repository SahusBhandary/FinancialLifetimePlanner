const mongoose = require('mongoose');
const UserModel = require('./models/User');
const TaxBracketModel = require('./models/TaxBracket');
const FederalTaxModel = require('./models/FederalTax');
const getTaxData = require('./scrape_taxbrackets');
const getTaxDeductionData = require('./scrape_taxdeductions');
const getCapitalTaxData = require('./scrape_capitaltax')

let mongoDB = 'mongodb://127.0.0.1:27017/flp';
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function createUser(userObj) {
    let newUser = new UserModel({
        name: userObj.name,
        email: userObj.email,
        age: userObj.age,
        stateOfResidence: userObj.stateOfResidence
    });
    return newUser.save();
}

async function initializeDB() {
    try {
      const brackets = await getTaxData();
      const singleTaxBrackets = brackets.singleTaxBracket;
      const marriedTaxBrackets = brackets.marriedTaxBracket;
      const singleTaxObjects = await TaxBracketModel.insertMany(singleTaxBrackets);
      const marriedTaxObjects = await TaxBracketModel.insertMany(marriedTaxBrackets);
  
      const taxdeductiondata = await getTaxDeductionData();
      
      const capitaltaxdata = await getCapitalTaxData();
      const singleCapitalTaxObjects = await TaxBracketModel.insertMany(capitaltaxdata.singleCapitalTax)
      const marriedCapitalTaxObjects = await TaxBracketModel.insertMany(capitaltaxdata.marriedCapitalTax)

      const federalTax = new FederalTaxModel({
        federalIncomeTaxBrackets: {
          single: singleTaxObjects.map(b => b._id),
          married: marriedTaxObjects.map(b => b._id),
        },
        standardDeductions: {
          single: taxdeductiondata.singleTaxDeductions.deduction.replace(/[^0-9]/g, ''),
          married: taxdeductiondata.marriedTaxDeductions.deduction.replace(/[^0-9]/g, ''),
        },
        capitalGainsTaxRates: {
          single: singleCapitalTaxObjects.map(b => b._id),
          married:marriedCapitalTaxObjects.map(b => b._id),
        }
      });
  
      await federalTax.save();  
  
      console.log("Federal tax saved..");
    } catch (error) {
      console.error("Error initializing db", error);
    }
  }
  

initializeDB()
    .catch((err) => {
        console.log('ERROR: ' + err);
        console.trace();
        if (db) {
            db.close();
        }
    });

console.log('Initializing data..');