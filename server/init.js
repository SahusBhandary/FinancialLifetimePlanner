const mongoose = require('mongoose');
const UserModel = require('./models/User');
const TaxBracketModel = require('./models/TaxBracket');
const FederalTaxModel = require('./models/FederalTax');
const StateTaxModel = require('./models/StateTax');

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

      let NewYorkSingleIncomeTaxBrackets = [
        {rate: 4, lower: 0, upper: 8500},
        {rate: 4.5, lower: 8500, upper: 11700, fixedAmount: 340},
        {rate: 5.25, lower: 11700, upper: 13900, fixedAmount: 484},
        {rate: 5.5, lower: 13900, upper: 80650, fixedAmount: 600},
        {rate: 6, lower: 80650, upper: 215400, fixedAmount: 4271},
        {rate: 6.85, lower: 215400, upper: 1077550, fixedAmount: 12356},
        {rate: 9.65, lower: 1077550, upper: 5000000, fixedAmount: 71413},
        {rate: 10.3, lower: 5000000, upper: 25000000, fixedAmount: 449929},
        {rate: 10.9, lower: 25000000, upper: "infinity", fixedAmount: 2509929},
      ]

      let NewYorkMarriedIncomeTaxBrackets = [
        {rate: 4, lower: 0, upper: 17150},
        {rate: 4.5, lower: 17150, upper: 23600, fixedAmount: 686},
        {rate: 5.25, lower: 23600, upper: 27900, fixedAmount: 976},
        {rate: 5.5, lower: 27900, upper: 161550, fixedAmount: 1202},
        {rate: 6, lower: 161550, upper: 323200, fixedAmount: 8553},
        {rate: 6.85, lower: 323200, upper: 2155350, fixedAmount: 18252},
        {rate: 9.65, lower: 2155350, upper: 5000000, fixedAmount: 143754},
        {rate: 10.3, lower: 5000000, upper: 25000000, fixedAmount: 418263},
        {rate: 10.9, lower: 25000000, upper: "infinity", fixedAmount: 2478263},
      ]

      NewYorkSingleIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(NewYorkSingleIncomeTaxBrackets)
      NewYorkMarriedIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(NewYorkMarriedIncomeTaxBrackets)
 
      const NY = new StateTaxModel({
        state: "New York",
        singleIncomeTaxBrackets: NewYorkSingleIncomeTaxBracketsObjects.map(b => b._id),
        marriedIncomeTaxBrackets: NewYorkMarriedIncomeTaxBracketsObjects.map(b => b._id)
      })

      await NY.save()


  
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


console.log('processing...');

