import { useState } from 'react'; 
import axios from 'axios'
import { useContext } from "react";
import { StoreContext } from "../store/Store";

const InvestmentForm = (props) => {
  const { user } = useContext(StoreContext);
  const [annualReturnOption, setAnnualReturnOption] = useState("");
  const [annualIncomeOption, setAnnualIncomeOption] = useState("");

  const [name, setName]  = useState("");
  const [description, setDescription]  = useState("");
  const [fixedReturnAmount, setFixedReturnAmount]  = useState("");
  const [percentReturnAmount, setPercentReturnAmount]  = useState("");
  const [returnMean, setReturnMean] = useState("");
  const [returnDeviation, setReturnDeviation] = useState("");
  const [sampleStatusReturn, setSampleStatusReturn] = useState(null);
  const [expenseRatio, setExpenseRatio] = useState("");
  const [fixedIncomeAmount, setFixedIncomeAmount]  = useState("");
  const [percentIncomeAmount, setPercentIncomeAmount] = useState("");
  const [incomeMean, setIncomeMean] = useState("");
  const [incomeDeviation, setIncomeDeivation] = useState("");
  const [sampleStatusIncome, setSampleStatusIncome] = useState(null);
  const [isTaxable, setIsTaxable] = useState(null);

  const [error, setError] = useState([]);
  
  

  const checkFields = () => {
    setError([]);

    let newErrors = [];
    newErrors.push(name.length === 0 ? "Investment name is required": "");    
    newErrors.push(description.length === 0 ? "Description is required." : "");

    // Error handling for expected annual return section
    newErrors.push(fixedReturnAmount.length === 0  && annualReturnOption === "fixed" ? "Please enter a value for fixed return" : "");
    newErrors.push(isNaN(fixedReturnAmount) && annualReturnOption === "fixed" ? "Fixed Amount for Expected Annual Return must be a number." : "");
    newErrors.push(percentReturnAmount.length === 0 && annualReturnOption === "percent" ? "Please enter a value for percent return" : "");
    newErrors.push((isNaN(percentReturnAmount) || percentReturnAmount > 100 || percentReturnAmount < 0)  && annualReturnOption === "percent" ? "Percent Change for Expected Annual Return must be a percentage value between 0% and 100%.": "");
    newErrors.push(returnMean.length === 0 && annualReturnOption === "normalDistribution" ? "Please enter a value for mean" : ""); 
    newErrors.push(isNaN(returnMean) && annualReturnOption === "normalDistribution"? "Mean needs to be a number value." : "");
    newErrors.push(returnDeviation.length === 0 && annualReturnOption === "normalDistribution" ? "Please enter a value for standard deviation" : ""); 
    newErrors.push(isNaN(returnDeviation) && annualReturnOption === "normalDistribution" ? "Standard Deviation needs to be a number value." : "");
    newErrors.push(sampleStatusReturn === null && annualReturnOption === "normalDistribution" ? "Please choose fixed amount or percent sampling" : "");

    newErrors.push(isNaN(expenseRatio) || expenseRatio > 100 || expenseRatio < 0? "Expense ratio must be a percentage value between 0% and 100%.": "");

    // Error handling for expected annual income section
    newErrors.push(fixedIncomeAmount.length === 0 && annualIncomeOption === "fixed" ? "Please enter a value for fixed return": "");
    newErrors.push(isNaN(fixedIncomeAmount) && annualIncomeOption === "fixed" ? "Fixed Amount for Expected Annual Income must be a number." : "");
    newErrors.push(percentIncomeAmount.length === 0 && annualIncomeOption === "percent" ? "Please enter a value for percent return" : "");
    newErrors.push((isNaN(percentIncomeAmount) || percentIncomeAmount > 100 || percentIncomeAmount < 0) && annualIncomeOption === "percent" ? "Percent Change for Expected Annual Income must be a percentage value between 0% and 100%." : "");
    newErrors.push(incomeMean.length === 0 && annualIncomeOption === "normalDistribution" ? "Please enter a value for mean" : "")
    newErrors.push(isNaN(incomeMean) && annualIncomeOption === "normalDistribution" ? "Mean needs to be a number value." : "");
    newErrors.push(incomeDeviation.length === 0 && annualIncomeOption === "normalDistribution" ? "Please enter a value for standard deviation" : "");
    newErrors.push(isNaN(incomeDeviation) && annualIncomeOption === "normalDistribution" ? "Standard Deviation needs to be a number value." : "");
    newErrors.push(sampleStatusIncome === null && annualIncomeOption === "normalDistribution" ? "Please choose fixed amount or percent sampling" : "");

    newErrors.push(isTaxable === null ? "Taxability status is required." : "");

    let errorFlag = false;
    for (let i = 0 ; i < newErrors.length; i++){
      if (newErrors[i] !== "")
        errorFlag = true;
    }

    setError(newErrors);

    if (errorFlag === false)
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

    if (type === "fixed"){  
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
    window.location.reload()
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
        {error[0] !== "" && <div>{error[0]}</div>}
      </div>

      {/* Description Form */}
      <div>
        <span>Description</span>
        <input type="text" onChange={(e) => setDescription(e.target.value)}></input>
        {error[1] !== "" && <div>{error[1]}</div>}
      </div>

      {/* Expected Annual Return Form*/}
      <div>
        <span>Expected Annual Return</span>   
        <select onChange={(e) => {
          setAnnualReturnOption(e.target.value)
          setError([]);
        }}>
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
        {error.map((error, i) =>  i >= 2 && i <= 10 && error !== "" ? <div key={i}>{error}</div> : null) }
      </div>
      
      {/* Expense Ratio Form*/}
      <div>
        <span>Expense Ratio</span>
        <input type="text" onChange={(e) => setExpenseRatio(e.target.value)}></input>
        {error[11] !== "" && <div>{error[11]}</div>}
      </div>  
      
      {/* Expected Annual Income Form*/}
      <div>
        <span>Expected Annual Income</span>    
        <select onChange={(e) => {
          setAnnualIncomeOption(e.target.value)
          setError([]);
          }}>
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
                <input type="radio" name="sampleStatusIncome" value="fixed" onChange={() => setSampleStatusIncome("fixed")}></input>
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
        {error.map((error, i) =>  i >= 12 && i <= 20 && error !== "" ? <div key={i}>{error}</div> : null) }
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

        {error[21] !== "" && <div>{error[21]}</div>}
      </div>

    </div>

    <button onClick={() => checkFields()}>Submit</button>
    </div>
  )
}

export default InvestmentForm;