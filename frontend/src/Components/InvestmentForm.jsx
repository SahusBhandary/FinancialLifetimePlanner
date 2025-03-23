import { useState } from 'react'; 
import axios from 'axios'
import { useContext } from "react";
import { StoreContext } from "../store/Store";
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl, InputLabel, RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material';


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
  const [expenseRatio, setExpenseRatio] = useState(null);
  const [fixedIncomeAmount, setFixedIncomeAmount]  = useState("");
  const [percentIncomeAmount, setPercentIncomeAmount] = useState("");
  const [incomeMean, setIncomeMean] = useState("");
  const [incomeDeviation, setIncomeDeviation] = useState("");
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

    newErrors.push(expenseRatio === null || isNaN(expenseRatio) || expenseRatio > 100 || expenseRatio < 0? "Expense ratio must be a percentage value between 0% and 100%.": "");

    // Error handling for expected annual income section
    newErrors.push(fixedIncomeAmount.length === 0 && annualIncomeOption === "fixed" ? "Please enter a value for fixed income amount": "");
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
      returnDistribution['stdev'] = returnDeviation;
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
      incomeDistribution['stdev'] = incomeDeviation;
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
      taxability: isTaxable === "taxable" ? true : false
    }
    // AI generation
    axios.post('http://localhost:8000/submitInvestmentType', {form: form, user: user})
    window.location.reload()
  }


  return (
    <div style={{width: '100%', marginLeft: '75px', marginRight: '75px',}}>
    {/* Investment Type Section */}
    <div className="form-div" style={{display: 'flex', alignContent: 'center', flexDirection: 'column',  marginTop: '30px'}}>
        <div>
          <h1 className='form-title'>Investment Type</h1>
        </div>
        {/* Name Form */}
        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
          <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Name</div>
          <TextField 
            label="Name"
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              width: '40%'
            }}
          />
          {error[0] !== "" && <div><br/>{error[0]}</div>}
      </div>
    
      {/* Description Form */}
      <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Description</div>
          <TextField 
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              width: '60%'
            }}
          />
          {error[1] !== "" && <div>{error[1]}</div>}
      </div>

      {/* Expected Annual Return Form*/}
      <div>
        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
          <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expected Annual Return</div>
          <FormControl fullWidth size="small" sx={{flex: 1}}>
            <InputLabel>Select an Option</InputLabel>
            <Select 
              data-testid="annual-return-select"
              onChange={(e) => {
              setAnnualReturnOption(e.target.value)
              setError([]);}}
              value={annualReturnOption}
              label="Select Option"
            >
            <MenuItem value="fixed">Fixed</MenuItem>
            <MenuItem value="percent">Percent Change</MenuItem>
            <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
            </Select>
          </FormControl>
        </div>
        {annualReturnOption === "fixed" && 
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Enter Fixed Amount</div>
              <div className='form-text' >(Annual Return)</div>
            </div>
            <TextField 
              data-testid="fixed-return-amount-input"
              label="Fixed Amount"
              onChange={(e) => setFixedReturnAmount(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
        }
        {annualReturnOption === "percent" &&
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Enter Percent Change</div>
              <div className='form-text' >(Annual Return)</div>
            </div>
            <TextField 
              label="Percent Change"
              onChange={(e) => setPercentReturnAmount(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
        }
        {annualReturnOption === "normalDistribution" &&
          <div>
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Mean</div>
              <div className='form-text' >(Annual Return)</div>
            </div>
            <TextField 
              label="Mean"
              onChange={(e) => setReturnMean(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div>
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Standard Deviation</div>
              <div className='form-text' >(Annual Return)</div>
            </div>
            <TextField 
              label="Standard Deviation"
              onChange={(e) => setReturnDeviation(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          </div>
          <div>
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
              <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sample a Fixed Amount or Percent</div>
              <FormControl>
                <RadioGroup
                  row
                  name="fixedPercent"
                  value={sampleStatusReturn}
                  onChange={(e) => setSampleStatusReturn(e.target.value)}
                >
                  <FormControlLabel value="fixed" control={<Radio />} label="Fixed"/>
                  <FormControlLabel value="percent" control={<Radio />} label="Percent"/>
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        }
        {error.map((error, i) =>  i >= 2 && i <= 10 && error !== "" ? <div key={i}>{error}</div> : null) }
      </div>
      {/* Expense Ratio Form*/}
      <div>
        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
          <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expense Ratio</div>
            <TextField 
            data-testid="expense-ratio-input"
              label="Expense Ratio"
              onChange={(e) => setExpenseRatio(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            {error[11] !== "" && <div>{error[11]}</div>}
        </div>
      </div>  
      
      {/* Expected Annual Income Form With AI generation*/}
      <div>
        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
          <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expected Annual Income</div>
          <FormControl fullWidth size="small" sx={{flex: 1}}>
            <InputLabel>Select an Option</InputLabel>
            <Select 
              data-testid="annual-income-select"
              onChange={(e) => {
                setAnnualIncomeOption(e.target.value)
                setError([]);
              }}
              value={annualIncomeOption}
              label="Select Option"
            >
            <MenuItem value="fixed">Fixed</MenuItem>
            <MenuItem value="percent">Percent Change</MenuItem>
            <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
            </Select>
          </FormControl>
        </div>
        {annualIncomeOption === "fixed" && 
        <div>
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Enter Fixed Amount</div>
              <div className='form-text' >(Annual Income)</div>
            </div>
            <TextField 
            data-testid="fixed-income-amount-input"
              label="Fixed Amount"
              onChange={(e) => setFixedIncomeAmount(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
        </div>
        }
        {annualIncomeOption === "percent" && 
        <div>
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Enter Percent Change</div>
              <div className='form-text' >(Annual Income)</div>
            </div>
            <TextField 
              label="Percent Change"
              onChange={(e) => setPercentIncomeAmount(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
        </div>
        }
        {annualIncomeOption === "normalDistribution" &&
        <div>
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Mean</div>
              <div className='form-text' >(Annual Income)</div>
            </div>
            <TextField 
              label="Mean"
              onChange={(e) => setIncomeMean(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
              <div className='form-text' >Standard Deviation</div>
              <div className='form-text' >(Annual Income)</div>
            </div>
            <TextField 
              label="Standard Deviation"
              onChange={(e) => setIncomeDeviation(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
          <div>
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
              <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sample a Fixed Amount or Percent</div>
              <FormControl>
                <RadioGroup
                  row
                  name="fixedPercent"
                  value={sampleStatusIncome}
                  onChange={(e) => setSampleStatusIncome(e.target.value)}
                >
                  <FormControlLabel value="fixed" control={<Radio />} label="Fixed"/>
                  <FormControlLabel value="percent" control={<Radio />} label="Percent"/>
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        }
        {error.map((error, i) =>  i >= 12 && i <= 20 && error !== "" ? <div key={i}>{error}</div> : null) }
      </div>


      {/* Taxability Form*/}
      <div >
        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
          <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Taxability</div>
          <FormControl>
            <RadioGroup
              row
              name="isTaxable"
              value={isTaxable}
              onChange={(e) => setIsTaxable(e.target.value)}
              sx={{display: 'flex'}}
            >
              <FormControlLabel value="taxable" control={<Radio />} label="Taxable"/>
              <FormControlLabel value="taxExempt" control={<Radio />} label="Tax Exempt"/>
            </RadioGroup>
          </FormControl>
        </div>
        {error[21] !== "" && <div>{error[21]}</div>}
      </div>
      <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
        <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={() => checkFields()}>Create</button>
      </div>
      
    </div>
    </div>    
  )
}

export default InvestmentForm;