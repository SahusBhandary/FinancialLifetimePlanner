const yaml = require('js-yaml');
const mongoose = require('mongoose');

const Scenario = require('./models/Scenario'); 
const InvestmentType = require('./models/InvestmentType'); 
const Investment = require('./models/Investment');
const EventSeries = require('./models/EventSeries'); 



// Function to export scenario into YAML string
async function exportScenarioToYAML(scenarioId) {
  try {
    console.log('Fetching scenario with ID:', scenarioId);

    // Validate ObjectId
    if (!mongoose.isValidObjectId(scenarioId)) {
      throw new Error('Invalid ObjectId');
    }

    // Fetch scenario with populated references
    const scenario = await Scenario.findById(scenarioId)
      .populate('investmentTypes')
      .populate({
        path: 'investments',
        populate: { path: 'investmentType' }, // Populate investmentType in investments
      })
      .populate('eventSeries')
      .exec();

    if (!scenario) {
      throw new Error('Scenario not found in the database');
    }

    console.log('Scenario found:', scenario);

    // Convert mongoose documents to plain objects
    const scenarioObject = scenario.toObject({ virtuals: true });
    scenarioObject.investmentTypes = scenario.investmentTypes.map((it) => it.toObject({ virtuals: true }));
    scenarioObject.investments = scenario.investments.map((inv) => inv.toObject({ virtuals: true }));
    scenarioObject.eventSeries = scenario.eventSeries.map((es) => es.toObject({ virtuals: true }));

    // Transform scenario into YAML
    const yamlData = {
      name: scenarioObject.name,
      maritalStatus: scenarioObject.maritalStatus,
      birthYears: scenarioObject.birthYears,
      lifeExpectancy: scenarioObject.lifeExpectancy.map((le) => ({
        type: le.type,
        value: le.value,
        mean: le.mean,
        stdev: le.stdev,
        lower: le.lower,
        upper: le.upper,
        mu: le.mu,
        sigma: le.sigma,
      })),
      investmentTypes: scenarioObject.investmentTypes.map((it) => ({
        name: it.name,
        description: it.description,
        returnAmtOrPct: it.returnAmtOrPct,
        returnDistribution: it.returnDistribution,
        expenseRatio: it.expenseRatio,
        incomeAmtOrPct: it.incomeAmtOrPct,
        incomeDistribution: it.incomeDistribution,
        taxability: it.taxability,
      })),
      investments: scenarioObject.investments.map((inv) => ({
        investmentType: inv.investmentType.name, 
        value: inv.value,
        taxStatus: inv.taxStatus,
        id: inv.id,
      })),
      eventSeries: scenarioObject.eventSeries.map((es) => ({
        name: es.name,
        start: es.start,
        duration: es.duration,
        type: es.type,
        initialAmount: es.initialAmount,
        changeAmtOrPct: es.changeAmtOrPct,
        changeDistribution: es.changeDistribution,
        inflationAdjusted: es.inflationAdjusted,
        userFraction: es.userFraction,
        socialSecurity: es.socialSecurity,
        discretionary: es.discretionary,
        assetAllocation: es.assetAllocation instanceof Map ? Object.fromEntries(es.assetAllocation) : es.assetAllocation,
        glidePath: es.glidePath,
        assetAllocation2: es.assetAllocation2 instanceof Map ? Object.fromEntries(es.assetAllocation2) : es.assetAllocation2,
        maxCash: es.maxCash,
      })),
      inflationAssumption: {
        type: scenarioObject.inflationAssumption.type,
        value: scenarioObject.inflationAssumption.value,
      },
      afterTaxContributionLimit: scenarioObject.afterTaxContributionLimit,
      spendingStrategy: scenarioObject.spendingStrategy,
      expenseWithdrawalStrategy: scenarioObject.expenseWithdrawalStrategy.map((id) =>
        scenarioObject.investments.find((inv) => inv._id.equals(id)).id
      ),
      RMDStrategy: scenarioObject.RMDStrategy.map((id) =>
        scenarioObject.investments.find((inv) => inv._id.equals(id)).id
      ),
      RothConversionOpt: scenarioObject.RothConversionOpt,
      RothConversionStart: scenarioObject.RothConversionStart,
      RothConversionEnd: scenarioObject.RothConversionEnd,
      RothConversionStrategy: scenarioObject.RothConversionStrategy.map((id) =>
        scenarioObject.investments.find((inv) => inv._id.equals(id)).id
      ),
      financialGoal: scenarioObject.financialGoal,
      residenceState: scenarioObject.residenceState,
    };

    let yamlString = yaml.dump(yamlData, { noRefs: true, flowLevel: 3, indent: 2 });

    // Add new lines between object references
    yamlString = yamlString
      .replace(/\ninvestmentTypes:/g, '\n\ninvestmentTypes:') 
      .replace(/\ninvestments:/g, '\n\ninvestments:') 
      .replace(/\neventSeries:/g, '\n\neventSeries:') 
      .replace(/\ninflationAssumption:/g, '\n\ninflationAssumption:');

    return yamlString; //returns a yaml string
  } catch (error) {
    console.error('Error exporting scenario:', error);
    throw error; 
  }
}

module.exports = exportScenarioToYAML;