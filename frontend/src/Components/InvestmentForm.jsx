import { useState } from 'react'; 
import NormalDistributionForm from "./NormalDistributionForm";
import axios from 'axios'
import { useContext } from "react";
import { StoreContext } from "../store/Store";

const InvestmentForm = (props) => {
  const { user } = useContext(StoreContext);
  const [annualReturnOption, setAnnualReturnOption] = useState("");
  const [annualIncomeOption, setAnnualIncomeOption] = useState("");

  const [name, setName]  = useState("");
  const [description, setDescription]  = useState("");
  const [fixedReturnAmount, setFixedReturnAmount]  = useState();
  const [percentReturnAmount, setPercentReturnAmount]  = useState("");
  const [returnMean, setReturnMean] = useState("");
  const [returnDeviation, setReturnDeviation] = useState("");
  const [sampleStatusReturn, setSampleStatusReturn] = useState();
  const [expenseRatio, setExpenseRatio] = useState("");
  const [fixedIncomeAmount, setFixedIncomeAmount]  = useState("");
  const [percentIncomeAmount, setPercentIncomeAmount] = useState("");
  const [incomeMean, setIncomeMean] = useState("");
  const [incomeDeviation, setIncomeDeivation] = useState("");
  const [sampleStatusIncome, setSampleStatusIncome] = useState();
  const [isTaxable, setIsTaxable] = useState(false);

  const [error, setError] = useState([]);

  const checkFields = () => {
    setError([]);
    if (isNaN(fixedReturnAmount))
      error.push("Fixed Amount for Expected Annual Return must be a number.");
    else
      error.push("");

    if (isNaN(percentReturnAmount) || percentReturnAmount > 100 || percentReturnAmount < 0 )
      error.push("Percent Change for Expected Annual Return must be a percentage value between 0% and 100%.")
    else
      error.push("");

    if (isNaN(returnMean))
      error.push("Mean needs to be a number value.");
    else
      error.push("");

    if (isNaN(returnDeviation))
      error.push("Standard Deviation needs to be a number value.");
    else
      error.push("");

    if (isNaN(expenseRatio) || expenseRatio > 100 || expenseRatio < 0 )
      error.push("Expense ratio must be a percentage value between 0% and 100%.")
    else
      error.push("");

    if (isNaN(fixedIncomeAmount))
      error.push("Fixed Amount for Expected Annual Income must be a number.");
    else
      error.push("");

    if (isNaN(percentIncomeAmount) || percentIncomeAmount > 100 || percentIncomeAmount < 0 )
      error.push("Percent Change for Expected Annual Income must be a percentage value between 0% and 100%.")
    else
      error.push("");

    if (isNaN(incomeMean))
      error.push("Mean needs to be a number value.");
    else
      error.push("");

    if (isNaN(incomeDeviation))
      error.push("Standard Deviation needs to be a number value.");
    else
      error.push("");


    handleSubmission();
  }

  const handleSubmission = () =>{
    let returnAmtOrPct = annualReturnOption;

    if (annualReturnOption === "normalDistribution")
      returnAmtOrPct = sampleStatusReturn;

    let type = annualReturnOption === "normalDistribution" ? "normal" : "fixed"

    let returnDistribution = {
      type: type,
    };

    if (type === "fixed"){   // thi smeans that it is either percent or amount, this means we need to push a value
      let value = null;
      annualReturnOption === "percent" ? value = percentReturnAmount/100 : value = fixedReturnAmount
      returnDistribution['value'] = value;
    }
    else{
      returnDistribution['mean'] = returnMean;
      returnDistribution['deviation'] = returnDeviation;
    }
      
    let incomeAmtOrPct = annualIncomeOption;
    if (annualIncomeOption === "normalDistribution")
        incomeAmtOrPct = sampleStatusIncome
    
    type = annualIncomeOption === "normalDistribution" ? "normal" : "fixed"

    let incomeDistribution = {
      type: type
    }

    if (type === "fixed"){
      let value = null;
      annualIncomeOption === "percent" ? value = percentIncomeAmount/100 : value = fixedIncomeAmount
      incomeDistribution['value'] = value;
    }
    else{
      incomeDistribution['mean'] = incomeMean;
      incomeDistribution['deviation'] = incomeDeviation;
    }

    if (returnAmtOrPct === "fixed") returnAmtOrPct = "amount";
    if (incomeAmtOrPct === "fixed") returnAmtOrPct = "amount";

    const form = {
      name: name,
      description: description,
      returnAmtOrPct: returnAmtOrPct,
      returnDistribution: returnDistribution,
      expenseRatio: expenseRatio,
      incomeAmtOrPct: incomeAmtOrPct,
      incomeDistribution: incomeDistribution,
      taxability: isTaxable
    }
  
    axios.post('http://localhost:8000/submitInvestmentType', {form: form, user: user})
  }


  return (
    <div>
       {/* Investment Type Section */}
    <div>
      <h1>Investment Type</h1>

      {/* Name Form */}
      <div>
        <span>Name</span>
        <input type="text" onChange={(e) => setName(e.target.value)} ></input>
      </div>

      {/* Description Form */}
      <div>
        <span>Description</span>
        <input type="text" onChange={(e) => setDescription(e.target.value)}></input>
      </div>

      {/* Expected Annual Return Form*/}
      <div>
        <span>Expected Annual Return</span>   
        <select onChange={(e) => setAnnualReturnOption(e.target.value)}>
        <option value="">Select an option</option>
        <option value="fixed">Fixed</option>
        <option value="percent">Percent Change</option>
        <option value="normalDistribution">Normal Distribution</option>
        </select>
        {annualReturnOption === "fixed" && 
        <div>
          <span>Enter Fixed Amount</span>
          <input type="text" onChange={(e) => setFixedReturnAmount(e.target.value)}></input>
        </div>
        }
        {annualReturnOption === "percent" &&
        <div>
          <span>Enter Percent Change</span>
          <input type="text" onChange={(e) => setPercentReturnAmount(e.target.value)}></input>
        </div>
        }
        {annualReturnOption === "normalDistribution" &&
        <div>
          <div>
            <span>Mean</span>
            <input type="text" onChange={(e) => setReturnMean(e.target.value)}></input>
            </div>
            <div>
            <span>Standard Deviation</span>
            <input type="text" onChange={(e) => setReturnDeviation(e.target.value)}></input>
          </div>

          <div>
            <form style={{ display: "inline-block"}}>
                <span> Sample a fixed or percent </span>
                <label>
                  <input type="radio" name="sampleStatusReturn" value="fixed" onChange={() => setSampleStatusReturn("fixed")}></input>
                  Fixed Amount
                </label>
                <label>
                  <input type="radio" name="sampleStatusReturn" value="percent" onChange={() => setSampleStatusReturn("percent")}></input>
                  Percent
                </label>
              </form>
          </div>
        </div>
        }
      </div>
      
      {/* Expense Ratio Form*/}
      <div>
        <span>Expense Ratio</span>
        <input type="text" onChange={(e) => setExpenseRatio(e.target.value)}></input>
      </div>  
      
      {/* Expected Annual Income Form*/}
      <div>
        <span>Expected Annual Income</span>    
        <select onChange={(e) => setAnnualIncomeOption(e.target.value)}>
        <option value="">Select an option</option>
        <option value="fixed">Fixed</option>
        <option value="percent">Percent Change</option>
        <option value="normalDistribution">Normal Distribution</option>
        </select>
        {annualIncomeOption === "fixed" && 
        <div>
          <span>Enter Fixed Amount</span>
          <input type="text" onChange={(e) => setFixedIncomeAmount(e.target.value)}></input>
        </div>
        }
        {annualIncomeOption === "percent" && 
        <div>
          <span>Enter Percent Change</span>
          <input type="text" onChange={(e) => setPercentIncomeAmount(e.target.value)}></input>
        </div>
        }
        {annualIncomeOption === "normalDistribution" &&
        <div>
          <div>
            <span>Mean</span>
            <input type="text" onChange={(e) => setIncomeMean(e.target.value)}></input>
          </div>
          <div>
            <span>Standard Deviation</span>
            <input type="text" onChange={(e) => setIncomeDeivation(e.target.value)}></input>
          </div>

          <div>
            <form style={{ display: "inline-block"}}>
              <span> Sample a fixed or percent </span>
              <label>
                <input type="radio" name="sampleStatusIncome" value="fixed" onChange={() => setSampleStatusIncome("percent")}></input>
                Fixed Amount
              </label>
              <label>
                <input type="radio" name="sampleStatusIncome" value="percent" onChange={() => setSampleStatusIncome("percent")}></input>
                Percent
              </label>
            </form>
          </div>
        </div>
        }
      </div>


      {/* Taxability Form*/}
      <div>
        <span>Taxability</span>
        <form style={{ display: "inline-block"}}>
          <label>
            <input type="radio" name="taxStatus" value="taxable" onChange={() => setIsTaxable(true)}></input>
            Taxable
          </label>
          <label>
            <input type="radio" name="taxStatus" value="taxExempt" onChange={() => setIsTaxable(false)}></input>
            Tax Exempt
          </label>
        </form>
      </div>

    </div>

    <button onClick={() => checkFields()}>Submit</button>
    </div>
  )
}

export default InvestmentForm;