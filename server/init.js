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

      // Gather data from tax bracket scrape
      const brackets = await getTaxData();
      const singleTaxBrackets = brackets.singleTaxBracket;
      const marriedTaxBrackets = brackets.marriedTaxBracket;
      const singleTaxObjects = await TaxBracketModel.insertMany(singleTaxBrackets);
      const marriedTaxObjects = await TaxBracketModel.insertMany(marriedTaxBrackets);
  
      // Gather data from tax deductions scrape
      const taxdeductiondata = await getTaxDeductionData();
      
      // Gather data from capital tax scrape
      const capitaltaxdata = await getCapitalTaxData();
      const singleCapitalTaxObjects = await TaxBracketModel.insertMany(capitaltaxdata.singleCapitalTax)
      const marriedCapitalTaxObjects = await TaxBracketModel.insertMany(capitaltaxdata.marriedCapitalTax)

      // Create federal tax model using previous scrape data
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

      // ADD NY TAX DATA TO DATABASE 
      // start
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
        state: "NY",
        singleIncomeTaxBrackets: NewYorkSingleIncomeTaxBracketsObjects.map(b => b._id),
        marriedIncomeTaxBrackets: NewYorkMarriedIncomeTaxBracketsObjects.map(b => b._id)
      })
      await NY.save()
      // end

      // ADD NJ TAX DATA TO DATABASE 
      // start
      let NewJerseySingleIncomeTaxBrackets = [
        {rate: 1.4, lower: 0, upper: 20000},
        {rate: 1.75, lower: 20000, upper: 35000, fixedAmount: 280},
        {rate: 3.5, lower: 35000, upper: 40000, fixedAmount: 542.5},
        {rate: 5.525, lower: 40000, upper: 75000, fixedAmount: 717.5},
        {rate: 6.37, lower: 75000, upper: 500000, fixedAmount: 2651.25},
        {rate: 8.97, lower: 500000, upper: 1000000, fixedAmount: 29723.75},
        {rate: 10.75, lower: 1000000, upper: "infinity", fixedAmount: 74573.75},
      ]
      let NewJerseykMarriedIncomeTaxBrackets = [
        {rate: 1.4, lower: 0, upper: 20000},
        {rate: 1.75, lower: 20000, upper: 50000, fixedAmount: 280},
        {rate: 2.45, lower: 50000, upper: 70000, fixedAmount: 805},
        {rate: 3.5, lower: 70000, upper: 80000, fixedAmount: 1295.5},
        {rate: 5.525, lower: 80000, upper: 150000, fixedAmount: 1644.5},
        {rate: 6.37, lower: 150000, upper: 500000, fixedAmount: 5512.5},
        {rate: 8.97, lower: 500000, upper: 1000000, fixedAmount: 27807.5},
        {rate: 10.75, lower: 1000000, upper: "infinity", fixedAmount: 72657.5},
      ]
      NewJerseySingleIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(NewJerseySingleIncomeTaxBrackets)
      NewJerseyMarriedIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(NewJerseykMarriedIncomeTaxBrackets)
      const NJ = new StateTaxModel({
        state: "NJ",
        singleIncomeTaxBrackets: NewJerseySingleIncomeTaxBracketsObjects.map(b => b._id),
        marriedIncomeTaxBrackets: NewJerseyMarriedIncomeTaxBracketsObjects.map(b => b._id)
      })
      await NJ.save()
      // end

      // ADD CT TAX DATA TO DATABASE 
      // start
      let ConnecticutSingleIncomeTaxBrackets = [
        {rate: 2, lower: 0, upper: 10000},
        {rate: 4.5, lower: 10000, upper: 50000, fixedAmount: 200},
        {rate: 5.5, lower: 50000, upper: 100000, fixedAmount: 2000},
        {rate: 6, lower: 100000, upper: 200000, fixedAmount: 4750},
        {rate: 6.5, lower: 200000, upper: 250000, fixedAmount: 10750},
        {rate: 6.9, lower: 250000, upper: 500000, fixedAmount: 14000},
        {rate: 6.99, lower: 500000, upper: "infinity", fixedAmount: 31250},
      ]
      let ConnecticutMarriedIncomeTaxBrackets = [
        {rate: 2, lower: 0, upper: 20000},
        {rate: 4.5, lower: 20000, upper: 100000, fixedAmount: 400},
        {rate: 5.5, lower: 100000, upper: 200000, fixedAmount: 4000},
        {rate: 6, lower: 200000, upper: 400000, fixedAmount: 9500},
        {rate: 6.5, lower: 400000, upper: 500000, fixedAmount: 21500},
        {rate: 6.9, lower: 500000, upper: 1000000, fixedAmount: 28000},
        {rate: 6.99, lower: 1000000, upper: "infinity", fixedAmount: 62500},
      ]
      ConnecticutSingleIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(ConnecticutSingleIncomeTaxBrackets)
      ConnecticutMarriedIncomeTaxBracketsObjects = await TaxBracketModel.insertMany(ConnecticutMarriedIncomeTaxBrackets)
      const CT = new StateTaxModel({
        state: "CT",
        singleIncomeTaxBrackets: ConnecticutSingleIncomeTaxBracketsObjects.map(b => b._id),
        marriedIncomeTaxBrackets: ConnecticutMarriedIncomeTaxBracketsObjects.map(b => b._id)
      })
      await CT.save()
      // end


  
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

