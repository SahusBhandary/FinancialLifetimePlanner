import { useState, useEffect } from 'react'; 
import NormalDistributionForm from './NormalDistributionForm.jsx';
import UniformDistributionForm from './UniformDistributionForm.jsx';
import AssetAllocationForm from "./AssetAllocationForm.jsx"
import { useContext } from "react";
import { StoreContext } from "../store/Store";
import axios from 'axios'

const EventForm = (props) => {
    const { user } = useContext(StoreContext);
    const [investments, setInvestments] = useState([]); // User's investment types
    const [listOfInvestments, setListOfInvestments] = useState([]); // User's investments
    const [events, setEvents] = useState([]); //  User's events

    const [startYearOption, setStartYearOption]  = useState("");
    const [durationOption, setDurationOption]  = useState("");
    const [eventType, setEventType] = useState("");
    const [assetAllocationType ,setAssetAllocationType] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Start Year Use States
    const [fixedStartYear, setFixedStartYear] = useState("");
    const [startYearMean, setStartYearMean] = useState("");
    const [startYearDeviation, setStartYearDeviation] = useState("");
    const [startYearUpper, setStartYearUpper] = useState("");
    const [startYearLower, setStartYearLower] = useState("");
    const [startYearEventName, setStartYearEventName] = useState("");
    const [endYearEventName, setEndYearEventName] = useState("");

    // Duration Use States
    const [fixedDuration, setFixedDuration] = useState("");
    const [durationMean, setDurationMean] = useState("");
    const [durationDeviation, setDurationDeviation] = useState("");
    const [durationUpper, setDurationUpper] = useState("");
    const [durationLower, setDurationLower] = useState("");


    // Income Use States
    const [annualChangeIncomeOption, setAnnualChangeIncomeOption] = useState("");
    const [sampleStatusAnnualChangeIncome, setSampleStatusAnnualChangeIncome] = useState("")
    const [initialAmountIncome, setInitialAmountIncome] = useState("");
    const [fixedAnnualChangeIncome, setFixedAnnualChangeIncome] = useState("");
    const [percentAnnualChangeIncome, setPercentAnnualChangeIncome] = useState("");
    const [incomeMean, setIncomeMean] = useState("");
    const [incomeDeviation, setIncomeDeviation] = useState(""); 
    const [incomeUpper, setIncomeUpper] = useState("");
    const [incomeLower, setIncomeLower] = useState("");
    const [incomeInflationFlag, setIncomeInflationFlag] = useState("");
    const [incomePercent, setIncomePercent] = useState("");
    const [socialSecurityFlag, setSocialSecurityFlag] = useState("");

    // Expense Use States
    const [annualChangeExpenseOption, setAnnualChangeExpenseOption] = useState("");
    const [sampleStatusAnnualChangeExpense, setSampleStatusAnnualChangeExpense] = useState("")
    const [initialAmountExpense, setInitialAmountExpense] = useState("");
    const [fixedAnnualChangeExpense, setFixedAnnualChangeExpense] = useState(""); 
    const [percentAnnualChangeExpense, setPercentAnnualChangeExpense] = useState("");
    const [expenseMean, setExpenseMean] = useState("");
    const [expenseDeviation, setExpenseDeviation] = useState("");
    const [expenseUpper, setExpenseUpper] = useState("");
    const [expenseLower, setExpenseLower] = useState("");
    const [expenseInflationFlag, setExpenseInflationFlag] = useState("");
    const [expensePercent, setExpensePercent] = useState("")
    const [discretionaryFlag, setDiscretionaryFlag] = useState("");
    
    // Invest Use States
    const [assetAllocationData, setAssetAllocationData] = useState();
    const [glidePathAllocationBefore, setGlidePathAllocationBefore] = useState();
    const [glidePathAllocationAfter, setGlidePathAllocationAfter] = useState();
    const [maxCash, setMaxCash] = useState("");

    // Rebalance Use States
    const [taxStatusReblanaceOption, setTaxStatusRebalanceOption] = useState("");
    const [assetAllocationDataNonRetirement, setAssetAllocationDataNonRetirement] = useState();
    const [assetAllocationDataPreTax, setAssetAllocationDataPreTax] = useState();
    const [assetAllocationDataAfterTax, setAssetAllocationAfterTax]  = useState();

    useEffect(() => {
        if (!user) {
            return
        }
        const fetchInvestmentType = async () => {
            if (user.investmentTypes.length > 0) {
                try {
                    const response = await axios.post('http://localhost:8000/getInvestments', {
                        investmentIds: user.investmentTypes
                    });

                    setInvestments(response.data); 
                } catch (error) {
                    console.error("Error fetching investment details:", error);
                }
            } 
        };

        const fetchEvents = async () => {
            if (user.events.length > 0) {
                try {
                    const response = await axios.post('http://localhost:8000/getEvents', {
                        eventIds: user.events
                    });

                    setEvents(response.data); 
                } catch (error) {
                    console.error("Error fetching event details:", error);
                }
            }
        };
        const fetchInvestments = async () => {
            if (user.investments.length > 0) {
                try {
                    const response = await axios.post('http://localhost:8000/getInvestmentList', {
                        investmentIds: user.investments
                    });
                    
                    setListOfInvestments(response.data); 
                    for (let i = 0; i < response.data.length; i++) {
                        listOfInvestments[i] = response.data[i]
                    }
                    
                } catch (error) {
                    console.error("Error fetching investment details:", error);
                }
            }
        };

        fetchInvestmentType();
        fetchEvents();
        fetchInvestments();
        setAssetAllocationData(Array(listOfInvestments.filter(investment => investment.taxStatus !== "pre-tax").length).fill(""));
        setGlidePathAllocationBefore(Array(listOfInvestments.filter(investment => investment.taxStatus !== "pre-tax").length).fill(""))
        setGlidePathAllocationAfter(Array(listOfInvestments.filter(investment => investment.taxStatus !== "pre-tax").length).fill(""))
        setAssetAllocationDataNonRetirement(Array(listOfInvestments.filter(investment => investment.taxStatus === "non-retirement").length).fill(""))
        setAssetAllocationDataPreTax(Array(listOfInvestments.filter(investment => investment.taxStatus === "pre-tax").length).fill(""))
        setAssetAllocationAfterTax(Array(listOfInvestments.filter(investment => investment.taxStatus === "after-tax").length).fill(""))
    }, [user, listOfInvestments.filter(investment => investment.taxStatus !== "pre-tax").length]);
    
    // A function that formats asset allocation from [{cash non-retirement: 0.5}, {SP500 non-retirement: 0.5}] --> {cash non-retirement: 0.5, SP500 non-retirement: 0.5}
    const assetAllocationFormatting = (assetAllocationArray) => {
        const formattedAllocation = assetAllocationArray.reduce((acc, obj) => {
            const [key, value] = Object.entries(obj)[0]; 
            if (value !== "") {  
                acc[key] = Number(value); 
            }
            return acc;
        }, {});

        return formattedAllocation
    };
    const checkFields = () => {
        

        handleSubmission();
    }
    const handleSubmission = async () => {
                
        let start = {
            type: startYearOption,
        }

        // Start Year data formatting based on the option selected.
        switch (startYearOption){
            case 'fixed':
                start['value'] = fixedStartYear
                break;
            case 'normal':
                start['mean'] = startYearMean;
                start['stdev'] = startYearDeviation;
                break;
            case 'uniform':
                start['lower'] = startYearLower;
                start['upper'] = startYearUpper;
                break;
            case 'startWith':
                start['eventSeries']  = startYearEventName;
                break;
            case 'endWith':
                start['eventSeries'] = endYearEventName;
                break;
        }

        let duration = {
            type: durationOption
        }

        // Duration data formatting based on the option selected.
        switch (durationOption) {
            case 'fixed':
                duration['value'] = fixedDuration;
                break;
            case 'normal':
                duration['mean'] = durationMean;
                duration['stdev'] = durationDeviation;
                break;
            case 'uniform':
                duration['lower'] = durationLower;
                duration['upper'] = durationUpper;
                break;
        }

        let event = {
            name: name,
            description: description,
            start: start,
            duration: duration,
            type: eventType,

        }

        // Data formatting based on the event type selected - Income, Expense, Invest, Rebalance
        switch (eventType) {
            case 'income':
                let changeAmtOrPctIncome = annualChangeIncomeOption;
                if (annualChangeIncomeOption === "normal" || annualChangeIncomeOption === "uniform")
                    changeAmtOrPctIncome = sampleStatusAnnualChangeIncome;

                let typeIncome = ((annualChangeIncomeOption === "amount" || annualChangeIncomeOption === "percent") ? "fixed" : null)

                if (typeIncome === null)
                    typeIncome = ((annualChangeIncomeOption === "normal") ? "normal" : "uniform")
                
                let changeDistributionIncome = {
                    type: typeIncome
                }
                switch (annualChangeIncomeOption) {
                    case 'amount':
                        changeDistributionIncome['value'] = fixedAnnualChangeIncome
                        break;
                    case 'percent':
                        changeDistributionIncome['value'] = percentAnnualChangeIncome
                        break;
                    case 'normal':
                        changeDistributionIncome['mean'] = incomeMean
                        changeDistributionIncome['stdev'] = incomeDeviation
                        break;
                    case 'uniform':
                        changeDistributionIncome['lower'] = incomeLower
                        changeDistributionIncome['upper'] = incomeUpper
                        break;
                }
                event['initialAmount'] = initialAmountIncome
                event['changeAmtOrPct'] = changeAmtOrPctIncome;
                event['changeDistribution'] = changeDistributionIncome;
                event['inflationAdjusted'] = incomeInflationFlag;
                event['userFraction'] = incomePercent;
                event['socialSecurity'] = socialSecurityFlag;
                break;
            case 'expense':
                let changeAmtOrPctExpense = annualChangeExpenseOption;
                if (annualChangeExpenseOption === "normal" || annualChangeExpenseOption === "uniform")
                    changeAmtOrPctExpense = sampleStatusAnnualChangeExpense
                
                let typeExpense = ((annualChangeExpenseOption === "amount" || annualChangeExpenseOption === "percent") ? "fixed" : null)
                if (typeExpense === null)
                    typeExpense = ((annualChangeExpenseOption === "normal") ? "normal" : "uniform");

                let changeDistributionExpense = {
                    type: typeExpense,
                }
                
                switch (annualChangeExpenseOption) {
                    case 'amount':
                        changeDistributionExpense['value'] = fixedAnnualChangeExpense
                        break;
                    case 'percent':
                        changeDistributionExpense['value'] = percentAnnualChangeExpense;
                        break;
                    case 'normal':
                        changeDistributionExpense['mean'] = expenseMean;
                        changeDistributionExpense['stdev'] = expenseDeviation;
                        break;
                    case 'uniform':
                        changeDistributionExpense['lower'] = expenseLower;
                        changeDistributionExpense['upper'] = expenseUpper;
                        break;
                }
                event['initialAmount'] = initialAmountExpense;
                event['changeAmtOrPct'] = changeAmtOrPctExpense;
                event['changeDistribution'] = changeDistributionExpense;
                event['inflationAdjusted'] = expenseInflationFlag;
                event['userFraction'] = expensePercent;
                event['discretionary'] = discretionaryFlag;
                break;
            case 'invest':
                if (assetAllocationType === "fixed"){
                    const formattedData = assetAllocationFormatting(assetAllocationData);
                    event['assetAllocation'] = formattedData;
                    event['maxCash'] = maxCash;
                    event['glidePath'] = false;
                }
                else{
                    const formattedAllocation1 = assetAllocationFormatting(glidePathAllocationBefore);
                    const formattedAllocation2 = assetAllocationFormatting(glidePathAllocationAfter)
                    event['assetAllocation'] = formattedAllocation1
                    event['assetAllocation2'] = formattedAllocation2;
                    event['maxCash'] = maxCash;
                    event['glidePath'] = true;
                }
                break;
            case 'rebalance':
                if (taxStatusReblanaceOption === "pre-tax")
                    event['assetAllocation'] = assetAllocationFormatting(assetAllocationDataPreTax)
                else if (taxStatusReblanaceOption === "after-tax")
                    event['assetAllocation'] = assetAllocationFormatting(assetAllocationDataAfterTax)
                else
                    event['assetAllocation'] = assetAllocationFormatting(assetAllocationDataNonRetirement);
                break;
        }

        console.log(event);
        const response = await axios.post('http://localhost:8000/submitEvent', {user: user, event: event});
        window.location.reload();
    }
    
    return (
       <>
       {/* Events Section */}
        <div>
        <h1>Events</h1>
        
        {/* Name Form */}
        <div>
            <span>Name</span>
            <input onChange={(e) => setName(e.target.value)} type="text"></input>
        </div>
        
        {/* Description Form */}
        <div>
            <span>Description</span>
            <input onChange={(e) => setDescription(e.target.value)} type="text"></input>
        </div>
        
        {/* Start Year Form */}
        <div>
            <span> Start Year </span>
            <select onChange={(e) => setStartYearOption(e.target.value)}>
            <option value="">Select an option</option>
            <option value="fixed">Fixed</option>
            <option value="normal">Normal Distribution</option>
            <option value="uniform">Uniform Distribution</option>
            <option value="startWith"> Start Year of Specified Event Series </option>
            <option value="endWith"> End Year of Specified Event Series </option>
            </select>

            {/* Start Year Different Options */}
            {startYearOption === "fixed" && 
            <div>
            <span>Enter Start Year</span>
            <input onChange={(e) => setFixedStartYear(e.target.value)}type="text"></input>
            </div>
            }

            {startYearOption === "normal" && 
            <div>
                <div>
                <span>Mean</span>
                <input onChange={(e) => setStartYearMean(e.target.value)}type="text"></input>
                </div>
                <div>
                <span>Standard Deviation</span>
                <input onChange={(e) => setStartYearDeviation(e.target.value)} type="text"></input>
                </div>
            </div>
            }

            {startYearOption === "uniform" && 
            <div>
                <div>
                <span>Upper Bound</span>
                <input onChange={(e) => setStartYearUpper(e.target.value)} type="text"></input>
                </div>
                <div>
                <span>Lower Bound</span>
                <input onChange={(e) => setStartYearLower(e.target.value)}type="text"></input>
                </div>
            </div>
            }

            {startYearOption === "startWith" && 
            <div>
                <span>Name of Event</span>
                <input onChange={(e) => setStartYearEventName(e.target.value)}  type="text"></input>
             </div>
            }

            {startYearOption === "endWith" && 
            <div>
                <span>Name of Event</span>
                <input onChange={(e) => setEndYearEventName(e.target.value)} type="text"></input>
            </div>
            }
        </div>


        {/* Duration Form */}
        <div>
            <span>Duration</span>
            <select onChange={(e) => setDurationOption(e.target.value)}>
            <option value="">Select an option</option>
            <option value="fixed">Fixed</option>
            <option value="normal">Normal Distribution</option>
            <option value="uniform">Uniform Distribution</option>
            </select>

            {/* Duration Different Options */}
            {durationOption === "fixed" &&
            <div>
            <span>Enter Duration</span>
            <input onChange={(e) => setFixedDuration(e.target.value)} type="text"></input>
            </div>
            }

            {durationOption === "normal" &&
            <div>
                <div>
                <span>Mean</span>
                <input onChange={(e) => setDurationMean(e.target.value)}type="text"></input>
                </div>
                <div>
                <span>Standard Deviation</span>
                <input onChange={(e) => setDurationDeviation(e.target.value)}type="text"></input>
                </div>
            </div>
            }

            {durationOption === "uniform" &&
            <div>
                <div>
                <span>Upper Bound</span>
                <input onChange={(e) => setDurationUpper(e.target.value)}type="text"></input>
                </div>
                <div>
                <span>Lower Bound</span>
                <input onChange={(e) => setDurationLower(e.target.value)}type="text"></input>
                </div>
            </div>
            }
        </div>
        

        {/* Event Type Section: Income, Expense, Invest, Rebalance */}
        <div>
            <span>Event Type</span>
            <select onChange={(e) => setEventType(e.target.value)}>
            <option value="">Select an option</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="invest">Invest</option>
            <option value="rebalance">Rebalance</option>
            </select>

            {/* Income Case */}
            { eventType === "income" &&
            <div>
                <div>
                <span>Initial Amount</span>
                <input onChange={(e) => setInitialAmountIncome(e.target.value)} type="text"></input>
                </div>
                <div>
                <span>Expected Annual Change</span>
                <select onChange={(e) => setAnnualChangeIncomeOption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="amount">Fixed</option>
                    <option value="percent">Percent Change</option>
                    <option value="normal">Normal Distribution</option>
                    <option value="uniform">Uniform Distribution</option>
                </select>

                {/* Different Options for Annual Change  */}
                {annualChangeIncomeOption === "amount" &&
                <div>
                    <span>Enter Fixed Amount</span>
                    <input onChange={(e) => setFixedAnnualChangeIncome(e.target.value)} type="text"></input>
                </div>
                }
                {annualChangeIncomeOption === "percent" &&
                <div>
                    <span>Enter Percent Change</span>
                    <input onChange={(e) => setPercentAnnualChangeIncome(e.target.value)} type="text"></input>
                </div>
                }
                {annualChangeIncomeOption === "normal" &&
                <div>
                 <div>
                   <span>Mean</span>
                   <input onChange={(e) => setIncomeMean(e.target.value)}type="text"></input>
                   </div>
                   <div>
                   <span>Standard Deviation</span>
                   <input onChange={(e) => setIncomeDeviation(e.target.value)} type="text"></input>
                 </div>
                 <form style={{ display: "inline-block"}}>
                        <span> Sample a fixed or percent </span>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="fixed" onChange={() => setSampleStatusAnnualChangeIncome("amount")}></input>
                        Fixed Amount
                        </label>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="percent" onChange={() => setSampleStatusAnnualChangeIncome("percent")}></input>
                        Percent
                        </label>
                    </form>
                </div>
                }
                {annualChangeIncomeOption === "uniform" &&
                <div>
                    <div>
                    <span>Upper Bound</span>
                    <input onChange={(e) => setIncomeUpper(e.target.value)}type="text"></input>
                    </div>
                    <div>
                    <span>Lower Bound</span>
                    <input onChange={(e) => setIncomeLower(e.target.value)} type="text"></input>
                    </div>
                    <form style={{ display: "inline-block"}}>
                        <span> Sample a fixed or percent </span>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="fixed" onChange={() => setSampleStatusAnnualChangeIncome("amount")}></input>
                        Fixed Amount
                        </label>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="percent" onChange={() => setSampleStatusAnnualChangeIncome("percent")}></input>
                        Percent
                        </label>
                    </form>
                </div>
                }
                </div>

                <div>
                <span>Inflation Adjusted</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="inflationFlagIncome" value="inflationTrue"onChange={(e) => setIncomeInflationFlag(true)}></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="inflationFlagIncome" value="inflationFalse" onChange={(e) => setIncomeInflationFlag(false)}></input>
                    No
                    </label>
                </form>
                </div>

                <div>
                <span>Percent Associated With User</span>
                <input onChange={(e) => setIncomePercent(e.target.value)} type="text"></input>
                </div>
                
                <div>
                <span>Is this income Social Security?</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="socialSecurityFlag" value="socialSecurityTrue" onChange={(e) => setSocialSecurityFlag(false)}></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="socialSecurityFlag" value="socialSecurityFalse" onChange={(e) => setSocialSecurityFlag(false)}></input>
                    No
                    </label>
                </form>
                </div>
                <button onClick={() => checkFields()}>Submit</button>
            </div>
            }
            
            {/* Expense Case */}
            {eventType ==="expense" &&
            <div>

                <div>
                <span>Initial Amount</span>
                <input onChange={(e)=> setInitialAmountExpense(e.target.value)}type="text"></input>
                </div>

                <div>
                <span>Expected Annual Change</span>
                <select onChange={(e) => setAnnualChangeExpenseOption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="amount">Fixed</option>
                    <option value="percent">Percent Change</option>
                    <option value="normal">Normal Distribution</option>
                    <option value="uniform">Uniform Distribution</option>
                </select>
                
                {/* Different Options for Annual Change for Expense */}
                {annualChangeExpenseOption === "amount" &&
                <div>
                    <span>Enter Fixed Amount</span>
                    <input onChange={(e) => setFixedAnnualChangeExpense(e.target.value)} type="text"></input>
                </div>
                }
                {annualChangeExpenseOption === "percent" &&
                <div>
                    <span>Enter Percent Change</span>
                    <input onChange={(e) => setPercentAnnualChangeExpense(e.target.value)} type="text"></input>
                </div>
                }
                {annualChangeExpenseOption === "normal" &&
                <div>
                    <div>
                    <span>Mean</span>
                    <input onChange={(e) => setExpenseMean(e.target.value)}type="text"></input>
                    </div>
                    <div>
                    <span>Standard Deviation</span>
                    <input onChange={(e) => setExpenseDeviation(e.target.value)} type="text"></input>
                    </div>
                    <form style={{ display: "inline-block"}}>
                        <span> Sample a fixed or percent </span>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="fixed" onChange={() => setSampleStatusAnnualChangeExpense("amount")}></input>
                        Fixed Amount
                        </label>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="percent" onChange={() => setSampleStatusAnnualChangeExpense("percent")}></input>
                        Percent
                        </label>
                    </form>
                </div>
                }
                {annualChangeExpenseOption === "uniform" &&
                <div>
                    <div>
                    <span>Upper Bound</span>
                    <input onChange={(e) => setExpenseUpper(e.target.value)}type="text"></input>
                    </div>
                    <div>
                    <span>Lower Bound</span>
                    <input onChange={(e) => setExpenseLower(e.target.value)}type="text"></input>
                    </div>

                    <form style={{ display: "inline-block"}}>
                        <span> Sample a fixed or percent </span>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="fixed" onChange={() => setSampleStatusAnnualChangeExpense("amount")}></input>
                        Fixed Amount
                        </label>
                        <label>
                        <input type="radio" name="sampleStatusReturn" value="percent" onChange={() => setSampleStatusAnnualChangeExpense("percent")}></input>
                        Percent
                        </label>
                    </form>
                </div>
                }
                </div>

                <div>
                <span>Inflation Adjusted</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="inflationFlagExpense" value="inflationTrue" onChange={(e) => setExpenseInflationFlag(true)}></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="inflationFlagExpense" value="inflationFalse" onChange={(e) => setExpenseInflationFlag(false)}></input>
                    No
                    </label>
                </form>
                </div>

                <div>
                <span>Percent Associated With User</span>
                <input onChange={(e) => setExpensePercent(e.target.value)} type="text"></input>
                </div>

                <div>
                <span>Is the expense discretionary?</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input onChange={(e) => setDiscretionaryFlag(true)} type="radio" name="discretionaryFlag" value="discretionaryFalse"></input>
                    Yes
                    </label>
                    <label>
                    <input onChange={(e) => setDiscretionaryFlag(false)} type="radio" name="discretionaryFlag" value="discretionaryTrue"></input>
                    No
                    </label>
                </form>
                </div>

                <button onClick={() => checkFields()}>Submit</button>
            </div>
            }
            
            {/* Invest Case */}
            { eventType === "invest" &&
            <div>
                <div>
                    <span>Enter type of asset allocation</span>
                    <select onChange={(e) => setAssetAllocationType(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="glidePath">Glide Path</option>
                    </select>

                    {/* Invest - Fixed Allocation Case */}
                    {(assetAllocationType === "fixed") &&
                    <div>
                        {listOfInvestments.filter(inv => inv.taxStatus !== "pre-tax").map((investment, index) => {
                            console.log(index);
                            return (<div>
                                <div>{investment.id}</div>
                                    <label>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        assetAllocationData[index] = investmentIDFormat;
                                        
                                    }}type="text" placeholder="Percent Allocation"></input>
                                    </label>
                                </div>);
                        })}
                    </div>
                    }

                    {/* Invest - Glide Path Case */}
                    {assetAllocationType === "glidePath" &&
                    <div>
                        {listOfInvestments.filter(inv => inv.taxStatus !== "pre-tax").map((investment, index) => {
                            return (<div>
                                <div>{investment.id}</div>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        glidePathAllocationBefore[index] = investmentIDFormat}} type="text" placeholder="Percent Allocation Before"></input>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        glidePathAllocationAfter[index] = investmentIDFormat}} type="text" placeholder="Percent Allocation After"></input>
                            </div>);
                        })}
                    </div>
                    }
                </div>
                <div>
                <span>Max Cash</span>
                <input onChange={(e) => setMaxCash(e.target.value)}type="text"></input>
                </div>
                <button onClick={() => checkFields()}>Submit</button>
            </div>
            }

            {/* Rebalance Case */}
            { eventType === "rebalance" &&
            <div>
                <div>
                    <span>Select your tax status account</span>
                    <select onChange={(e) => setTaxStatusRebalanceOption(e.target.value)}>
                        <option value="">Select an option</option>
                        <option value="non-retirement">Non-Retirement</option>
                        <option value="pre-tax">Pre-Tax</option>
                        <option value="after-tax">After-Tax</option>
                    </select>

                    {/* Rebalance - Non-Retirement Case */}
                    {taxStatusReblanaceOption === "non-retirement" &&
                        <div>
                            {listOfInvestments.filter(inv => inv.taxStatus === "non-retirement").map((investment, index) => {
                            return (<div>
                                <div>{investment.id}</div>
                                    <label>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        assetAllocationDataNonRetirement[index] = investmentIDFormat;
                                    }}type="text" placeholder="Percent Allocation"></input>
                                    </label>
                                </div>);
                            })}
                        </div>
                    }

                    {/* Rebalance - Pre-Tax Case */}
                    {taxStatusReblanaceOption === "pre-tax" &&
                        <div>
                            {listOfInvestments.filter(inv => inv.taxStatus === "pre-tax").map((investment, index) => {
                            return (<div>
                                <div>{investment.id}</div>
                                    <label>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        assetAllocationDataPreTax[index] = investmentIDFormat;
                                    }}type="text" placeholder="Percent Allocation"></input>
                                    </label>
                                </div>);
                            })}
                        </div>
                    }   

                    {/* Rebalance After-Tax Case */}
                    {taxStatusReblanaceOption === "after-tax" &&
                        <div>
                            {listOfInvestments.filter(inv => inv.taxStatus === "after-tax").map((investment, index) => {
                            return (<div>
                                <div>{investment.id}</div>
                                    <label>
                                    <input onChange={(e) => {
                                        let investmentIDFormat = {
                                            [investment.id] : e.target.value
                                        };
                                        assetAllocationDataAfterTax[index] = investmentIDFormat;
                                    }}type="text" placeholder="Percent Allocation"></input>
                                    </label>
                                </div>);
                            })}
                        </div>
                    }
                </div>

                <button onClick={() => checkFields()}>Submit</button>
            </div>   
            }
        </div>
        </div>
       </>
    
    )
}

export default EventForm;