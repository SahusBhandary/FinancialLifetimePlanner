import { useState, useEffect } from 'react'; 
import NormalDistributionForm from './NormalDistributionForm.jsx';
import UniformDistributionForm from './UniformDistributionForm.jsx';
import AssetAllocationForm from "./AssetAllocationForm.jsx"
import { useContext } from "react";
import { StoreContext } from "../store/Store";
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl, InputLabel, RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material';
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

        const response = await axios.post('http://localhost:8000/submitEvent', {user: user, event: event});
        window.location.reload();
    }
    

    return (
       <>
       {/* Events Section */}
        <div style={{width: '100%', marginLeft: '75px', marginRight: '75px',}}>
            <div className="form-div" style={{display: 'flex', alignContent: 'center', flexDirection: 'column',  marginTop: '30px'}}>
            <div>
                <h1 className='form-title'>Events</h1>
            </div>
            {/* Name Form */}
            <div>
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
                </div>
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
            </div>
            {/* Start Year Form */}
            <div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Start Year</div>
                    <FormControl fullWidth size="small" sx={{flex: 1}}>
                        <InputLabel>Select an Option</InputLabel>
                        <Select 
                        onChange={(e) => {setStartYearOption(e.target.value)}}
                        value={startYearOption}
                        label="Select Option"
                        >
                        <MenuItem value="fixed">Fixed</MenuItem>
                        <MenuItem value="normal">Normal Distribution</MenuItem>
                        <MenuItem value="uniform">Uniform Distribution</MenuItem>  
                        <MenuItem value="startWith">Start Year of Specified Event Series</MenuItem>  
                        <MenuItem value="endWith">End Year of Specified Event Series</MenuItem> 
                        </Select>
                    </FormControl>
                </div>
                {/* Start Year Different Options */}
                {startYearOption === "fixed" && 
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Start Year</div>
                        <TextField 
                            label="Start Year"
                            onChange={(e) => setFixedStartYear(e.target.value)}
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
                {startYearOption === "normal" && 
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                        <TextField 
                            label="Mean"
                            onChange={(e) => setStartYearMean(e.target.value)}
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
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Standard Deviation</div>
                        <TextField 
                            label="Standard Deviation"
                            onChange={(e) => setStartYearDeviation(e.target.value)}
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
                {startYearOption === "uniform" && 
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Upper Bound</div>
                        <TextField 
                            label="Upper Bound"
                            onChange={(e) => setStartYearUpper(e.target.value)}
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
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Lower Bound</div>
                        <TextField 
                            label="Lower Bound"
                            onChange={(e) => setStartYearLower(e.target.value)}
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
                {startYearOption === "startWith" && 
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Name of Event</div>
                    <TextField 
                        label="Name of Event"
                        onChange={(e) => setStartYearEventName(e.target.value)}
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
                {startYearOption === "endWith" &&
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Name of Event</div>
                    <TextField 
                        label="Name of Event"
                        onChange={(e) => setEndYearEventName(e.target.value)}
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
            </div>
            {/* Duration Form */}
            <div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Duration</div>
                    <FormControl fullWidth size="small" sx={{flex: 1}}>
                        <InputLabel>Select an Option</InputLabel>
                        <Select 
                        onChange={(e) => setDurationOption(e.target.value)}
                        value={durationOption}
                        label="Select Option"
                        >
                        <MenuItem value="fixed">Fixed</MenuItem>
                        <MenuItem value="normal">Normal Distribution</MenuItem>
                        <MenuItem value="uniform">Uniform Distribution</MenuItem>  
                        </Select>
                    </FormControl>
                </div>
                {/* Duration Different Options */}
                {durationOption === "fixed" &&
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Duration</div>
                    <TextField 
                        label="Duration"
                        onChange={(e) => setFixedDuration(e.target.value)}
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
                {durationOption === "normal" &&
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                        <TextField 
                            label="Mean"
                            onChange={(e) => setDurationMean(e.target.value)}
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
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Standard Deviation</div>
                        <TextField 
                            label="Standard Deviation"
                            onChange={(e) => setDurationDeviation(e.target.value)}
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
                {durationOption === "uniform" &&
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Upper Bound</div>
                        <TextField 
                            label="Upper Bound"
                            onChange={(e) => setDurationUpper(e.target.value)}
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
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Lower Bound</div>
                        <TextField 
                            label="Lower Bound"
                            onChange={(e) => setDurationLower(e.target.value)}
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
            </div>
            {/* Event Type Section: Income, Expense, Invest, Rebalance */}
            <div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Event Type</div>
                    <FormControl fullWidth size="small" sx={{flex: 1}}>
                        <InputLabel>Select an Option</InputLabel>
                        <Select 
                        onChange={(e) => setEventType(e.target.value)}
                        value={eventType}
                        label="Select Option"
                        >
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="invest">Invest</MenuItem>  
                        <MenuItem value="rebalance">Rebalance</MenuItem>  
                        </Select>
                    </FormControl>
                </div>
                {/* Income Case */}
                { eventType === "income" &&
                <div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Initial Amount</div>
                            <TextField 
                                label="Initial Amount"
                                onChange={(e) => setInitialAmountIncome(e.target.value)}
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
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expected Annual Change</div>
                        <FormControl fullWidth size="small" sx={{flex: 1}}>
                            <InputLabel>Select an Option</InputLabel>
                            <Select 
                            onChange={(e) => setAnnualChangeIncomeOption(e.target.value)}
                            value={annualChangeIncomeOption}
                            label="Select Option"
                            >
                            <MenuItem value="amount">Fixed</MenuItem>
                            <MenuItem value="percent">Percent Change</MenuItem>
                            <MenuItem value="normal">Normal Distribution</MenuItem>  
                            <MenuItem value="uniform">Uniform Distribution</MenuItem>  
                            </Select>
                        </FormControl>
                    </div>
                    {/* Different Options for Annual Change  */}
                    {annualChangeIncomeOption === "amount" &&
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                            <TextField 
                                label="Fixed Amount"
                                onChange={(e) => setFixedAnnualChangeIncome(e.target.value)}
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
                    {annualChangeIncomeOption === "percent" &&
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Percent Change</div>
                            <TextField 
                                label="Percent Change"
                                onChange={(e) => setPercentAnnualChangeIncome(e.target.value)}
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
                    {annualChangeIncomeOption === "normal" &&
                    <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
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
                        </div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Standard Deviation</div>
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
                        </div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sample a Fixed Amount or Percent</div>
                                <FormControl>
                                    <RadioGroup
                                    row
                                    name="fixedPercent"
                                    value={sampleStatusAnnualChangeIncome}
                                    onChange={(e) => setSampleStatusAnnualChangeIncome(e.target.value)}
                                    >
                                    <FormControlLabel value="fixed" control={<Radio />} label="Fixed"/>
                                    <FormControlLabel value="percent" control={<Radio />} label="Percent"/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    }
                    {annualChangeIncomeOption === "uniform" &&
                    <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Upper Bound</div>
                                <TextField 
                                    label="Upper Bound"
                                    onChange={(e) => setIncomeUpper(e.target.value)}
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
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Lower Bound</div>
                                <TextField 
                                    label="Lower Bound"
                                    onChange={(e) => setIncomeLower(e.target.value)}
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
                                    value={sampleStatusAnnualChangeIncome}
                                    onChange={(e) => setSampleStatusAnnualChangeIncome(e.target.value)}
                                    >
                                    <FormControlLabel value="amount" control={<Radio />} label="Fixed"/>
                                    <FormControlLabel value="percent" control={<Radio />} label="Percent"/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Inflation Adjustment</div>
                        <FormControl>
                            <RadioGroup
                            row
                            name="fixedPercent"
                            value={incomeInflationFlag}
                            onChange={(e) => setIncomeInflationFlag(e.target.value)}
                            >
                            <FormControlLabel name="inflationFlagIncome" value={true} control={<Radio />} label="Yes"/>
                            <FormControlLabel name="inflationFlagIncome" value={false} control={<Radio />} label="No"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Percent Associated With User</div>
                        <TextField 
                            label="Percent"
                            onChange={(e) => setIncomePercent(e.target.value)}
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
                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Is This Income Social Security?</div>
                        <FormControl>
                            <RadioGroup
                            row
                            name="socialSecurity"
                            value={socialSecurityFlag}
                            onChange={(e) => setSocialSecurityFlag(e.target.value)}
                            >
                            <FormControlLabel name="socialSecurityFlag" value={true} control={<Radio />} label="Yes"/>
                            <FormControlLabel name="socialSecurityFlag" value={false} control={<Radio />} label="No"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
                    <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={() => checkFields()}>Create</button>
                </div>
                </div>
                }
                {/* Expense Case */}
                {eventType ==="expense" &&
                <div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Initial Amount</div>
                            <TextField 
                                label="Initial Amount"
                                onChange={(e) => setInitialAmountExpense(e.target.value)}
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
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expected Annual Change</div>
                            <FormControl fullWidth size="small" sx={{flex: 1}}>
                                <InputLabel>Select an Option</InputLabel>
                                <Select 
                                onChange={(e) => setAnnualChangeExpenseOption(e.target.value)}
                                value={annualChangeExpenseOption}
                                label="Select Option"
                                >
                                <MenuItem value="amount">Fixed</MenuItem>
                                <MenuItem value="percent">Percent Change</MenuItem>
                                <MenuItem value="normal">Normal Distribution</MenuItem>  
                                <MenuItem value="uniform">Uniform Distribution</MenuItem>  
                                </Select>
                            </FormControl>
                        </div>
                    
                        {/* Different Options for Annual Change for Expense */}
                        {annualChangeExpenseOption === "amount" &&
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                                <TextField 
                                    label="Fixed Amount"
                                    onChange={(e) => setFixedAnnualChangeExpense(e.target.value)}
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
                        {annualChangeExpenseOption === "percent" &&
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Percent Change</div>
                                <TextField 
                                    label="Percent Change"
                                    onChange={(e) => setPercentAnnualChangeExpense(e.target.value)}
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
                        {annualChangeExpenseOption === "normal" &&
                        <div>
                            <div>
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                                    <TextField 
                                        label="Mean"
                                        onChange={(e) => setExpenseMean(e.target.value)}
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
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Standard Deviation</div>
                                    <TextField 
                                        label="Standard Deviation"
                                        onChange={(e) => setExpenseDeviation(e.target.value)}
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
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sample a Fixed or Percent</div>
                                    <FormControl>
                                        <RadioGroup
                                        row
                                        name="fixedPercent"
                                        value={sampleStatusAnnualChangeExpense}
                                        onChange={(e) => setSampleStatusAnnualChangeExpense(e.target.value)}
                                        >
                                        <FormControlLabel name="sampleStatusReturn" value="fixed" control={<Radio />} label="Fixed"/>
                                        <FormControlLabel name="sampleStatusReturn" value="percent" control={<Radio />} label="Percent"/>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        }
                        {annualChangeExpenseOption === "uniform" &&
                        <div>
                            <div>
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Upper Bound</div>
                                    <TextField 
                                        label="UpperBound"
                                        onChange={(e) => setExpenseUpper(e.target.value)}
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
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Lower Bound</div>
                                    <TextField 
                                        label="LowerBound"
                                        onChange={(e) => setExpenseLower(e.target.value)}
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
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sample a Fixed or Percent</div>
                                    <FormControl>
                                        <RadioGroup
                                        row
                                        name="fixedPercent"
                                        value={sampleStatusAnnualChangeExpense}
                                        onChange={(e) => setSampleStatusAnnualChangeExpense(e.target.value)}
                                        >
                                        <FormControlLabel name="sampleStatusReturn" value="fixed" control={<Radio />} label="Fixed"/>
                                        <FormControlLabel name="sampleStatusReturn" value="percent" control={<Radio />} label="Percent"/>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Inflation Adjustment</div>
                            <FormControl>
                                {console.log()}
                                <RadioGroup
                                row
                                name="fixedPercent"
                                value={expenseInflationFlag}
                                onChange={(e) => setExpenseInflationFlag(e.target.value)}
                                >
                                <FormControlLabel name="sampleStatusReturn" value={true} control={<Radio />} label="Yes"/>
                                <FormControlLabel name="sampleStatusReturn" value={false} control={<Radio />} label="No"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Percent Associated With User</div>
                            <TextField 
                                label="Percent"
                                onChange={(e) => setExpensePercent(e.target.value)}
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
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Is the Expense Discretionary?</div>
                            <FormControl>
                                <RadioGroup
                                row
                                name="discretionary"
                                value={discretionaryFlag}
                                onChange={(e) => setDiscretionaryFlag(e.target.value)}
                                >
                                <FormControlLabel name="sampleStatusReturn" value={true} control={<Radio />} label="Yes"/>
                                <FormControlLabel name="sampleStatusReturn" value={false} control={<Radio />} label="No"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
                        <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={() => checkFields()}>Create</button>
                    </div>
                </div>
                }
                {/* Invest Case */}
                { eventType === "invest" &&
                <div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Type of Asset Allocation</div>
                            <FormControl fullWidth size="small" sx={{flex: 1}}>
                                <InputLabel>Select an Option</InputLabel>
                                <Select 
                                onChange={(e) => setAssetAllocationType(e.target.value)}
                                value={assetAllocationType}
                                label="Select Option"
                                >
                                <MenuItem value="fixed">Fixed</MenuItem>
                                <MenuItem value="glidePath">Glide Path</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {/* Invest - Fixed Allocation Case */}
                        {(assetAllocationType === "fixed") &&
                        <div>
                            {listOfInvestments.filter(inv => inv.taxStatus !== "pre-tax").map((investment, index) => {
                                return (
                                <div>
                                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>{investment.id}</div>
                                        <TextField 
                                            label="Percent Allocation"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                                assetAllocationData[index] = investmentIDFormat;
                                            }}
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
                                );
                            })}
                        </div>
                        }

                        {/* Invest - Glide Path Case */}
                        {assetAllocationType === "glidePath" &&
                        <div>
                            {listOfInvestments.filter(inv => inv.taxStatus !== "pre-tax").map((investment, index) => {
                                return (
                                <div>
                                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>{investment.id}</div>
                                        <TextField 
                                            label="Percent Allocation Before"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                            glidePathAllocationBefore[index] = investmentIDFormat}}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                            }}
                                        />
                                        <TextField 
                                            label="Percent Allocation After"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                                glidePathAllocationAfter[index] = investmentIDFormat}}
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
                                );
                            })}
                        </div>
                        }
                    </div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Max Cash</div>
                            <TextField 
                                label="Max Cash"
                                onChange={(e) => setMaxCash(e.target.value)}
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
                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
                        <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={() => checkFields()}>Create</button>
                    </div>
                </div>
                }
                {/* Rebalance Case */}
            {eventType === "rebalance" &&
                <div>
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Select Your Tax Status Account</div>
                            <FormControl fullWidth size="small" sx={{flex: 1}}>
                                <InputLabel>Select an Option</InputLabel>
                                <Select 
                                onChange={(e) => setTaxStatusRebalanceOption(e.target.value)}
                                value={taxStatusReblanaceOption}
                                label="Select Option"
                                >
                                <MenuItem value="non-retirement">Non-Retirement</MenuItem>
                                <MenuItem value="pre-tax">Pre-Tax</MenuItem>
                                <MenuItem value="After-Tax">After-Tax</MenuItem>
                                </Select>
                            </FormControl>
                        </div>


                        {/* Rebalance - Non-Retirement Case */}
                        {taxStatusReblanaceOption === "non-retirement" &&
                            <div>
                                {listOfInvestments.filter(inv => inv.taxStatus === "non-retirement").map((investment, index) => {
                                return (
                                <div key={investment.id}>
                                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>{investment.id}</div>
                                        <TextField 
                                            label="Percent Allocation"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                                assetAllocationDataNonRetirement[index] = investmentIDFormat;
                                            }}
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
                                );
                                })}
                            </div>
                        }


                        {/* Rebalance - Pre-Tax Case */}
                        {taxStatusReblanaceOption === "pre-tax" &&
                            <div>
                                {listOfInvestments.filter(inv => inv.taxStatus === "pre-tax").map((investment, index) => {
                                return (<div key={investment.id}>
                                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>{investment.id}</div>
                                        <TextField 
                                            label="Percent Allocation"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                                assetAllocationDataPreTax[index] = investmentIDFormat;
                                            }}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                            }}
                                        />
                                    </div>
                                    </div>);
                                })}
                            </div>
                        }   

                        {/* Rebalance After-Tax Case */}
                        {taxStatusReblanaceOption === "after-tax" &&
                            <div>
                                {listOfInvestments.filter(inv => inv.taxStatus === "after-tax").map((investment, index) => {
                                return (<div key={investment.id}>
                                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                        <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>{investment.id}</div>
                                        <TextField 
                                            label="Percent Allocation"
                                            onChange={(e) => {
                                                let investmentIDFormat = {
                                                    [investment.id] : e.target.value
                                                };
                                                assetAllocationDataAfterTax[index] = investmentIDFormat;
                                            }}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                            }}
                                        />
                                    </div>
                                    </div>);
                                })}
                            </div>
                        }
                    </div>

                    <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
                        <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={() => checkFields()}>Create</button>
                    </div>
                </div>   
            }

            </div>
        </div>
        </div>
        
        
       </>
    
    )
}

export default EventForm;