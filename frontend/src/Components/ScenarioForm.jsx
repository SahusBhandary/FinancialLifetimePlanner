import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from "../store/Store";
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl, InputLabel, RadioGroup, Radio, FormControlLabel, FormLabel, Checkbox } from '@mui/material';

const ScenerioForm = (props) => {
    const { user } = useContext(StoreContext);
    const [ emptyExpenseStrategyError, setEmptyExpenseStrategyError ] = useState()

    const [name, setName] = useState("");
    const [isMarried, setIsMarried] = useState("");
    const [userBirthYear, setUserBirthYear] = useState("");
    const [spouseBirthYear, setSpouseBirthYear] = useState("");
    const [userLifeExpectancyDistribution, setUserLifeExpectancyDistribution] = useState("");
    const [userLifeExpectancyFixed, setUserLifeExpectancyFixed] = useState("");
    const [userLifeExpectancyMean, setUserLifeExpectancyMean] = useState("");
    const [userLifeExpectancyDeviation, setUserLifeExpectancyDeviation] = useState("");
    const [spouseLifeExpectancyDistribution, setSpouseLifeExpectancyDistribution] = useState("");
    const [spouseLifeExpectancyFixed, setSpouseLifeExpectancyFixed] = useState("");
    const [spouseLifeExpectancyMean, setSpouseLifeExpectancyMean] = useState("");
    const [spouseLifeExpectancyDeviation, setSpouseLifeExpectancyDeviation] = useState("");
    const [investments, setInvestments] = useState([]); 
    const [events, setEvents] = useState([]); 
    const [inflationAssumption, setInflationAssumption] = useState("")
    const [fixedIncomeAmount, setFixedIncomeAmount] = useState("")
    const [incomeMean, setIncomeMean] = useState("")
    const [incomeDeviation, setIncomeDeviation] = useState("")
    const [uniformLower, setUniformLower] = useState("")
    const [uniformUpper, setUniformUpper] = useState("")
    const [limitOnAnnualContributions, setLimitOnAnnualContributions] = useState("")
    const [spendingStrategy, setSpendingStrategy] = useState("")
    const [expenseWithdrawlStrategy, setExpenseWithdrawlStrategy] = useState("")
    const [RMDStrategy, setRMDStrategy] = useState("")
    const [rothConversionStrategy, setRothConversionStrategy] = useState("")
    const [rothConvesionOptimizerSettings, setRothConversionOptimizerSettings] = useState("")
    const [rothConversionStartYear, setRothConversionStartYear] = useState("")
    const [rothConversionEndYear, setRothConversionEndYear] = useState("")
    const [sharingSettings, setSharingSettings] = useState("")
    const [financialGoal, setFinancialGoal] = useState("")
    const [stateOfResidence, setStateOfResidence] = useState("")
    const [expenseCount, setExpenseCount] = useState(0);
    const [expenseWithdrawlInvestmentsCount, setExpenseWithdrawlInvestmentsCount] = useState(0);
    const [RMDInvestments, setRMDInvestments] = useState(0);
    const [listofinvestments, setListOfInvestments] = useState([])
    const [selectedExpensesOrder, setSelectedExpensesOrder] = useState([]);
    const [selectedInvestmentsOrder, setSelectedInvestmentsOrder] = useState([]);
    const [selectedRMDInvestmentsOrder, setSelectedRMDInvestmentsOrder] = useState([]);
    const [rothInvestments, setRothInvestments] = useState([]);

    const [selectedInvestments, setSelectedInvestments] = useState([]);
    const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);

    
    // states for upload state tax
    const [file, setFile] = useState(null);
    const [stateExists, setStateExists] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [message, setMessage] = useState('');
    
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

        const fetchInvestments = async () => {
            if (user.investments.length > 0) {
                try {
                    const response = await axios.post('http://localhost:8000/getInvestmentList', {
                        investmentIds: user.investments
                    });
                    
                    setListOfInvestments(response.data); 
                    for (let i = 0; i < response.data.length; i++) {
                        listofinvestments[i] = response.data[i]
                    }
                    
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
        

        fetchInvestmentType();
        fetchInvestments();
        fetchEvents();
        setSelectedInvestmentsOrder((prev) => {
            const updatedOrder = [
                ...selectedInvestmentsOrder,                     
                ...prev.slice(expenseWithdrawlInvestmentsCount)   
            ];
            return updatedOrder;
        });
        while(selectedInvestmentsOrder.length > expenseWithdrawlInvestmentsCount) {
            selectedInvestmentsOrder.pop()
        }
        if (selectedInvestmentsOrder.length < expenseWithdrawlInvestmentsCount) {
            selectedInvestmentsOrder.push('')
        }

        setSelectedRMDInvestmentsOrder((prev) => {
            const updatedOrder = [
                ...selectedRMDInvestmentsOrder,                     
                ...prev.slice(RMDInvestments)   
            ];
            return updatedOrder;
        });
        while(selectedRMDInvestmentsOrder.length > RMDInvestments) {
            selectedRMDInvestmentsOrder.pop()
        }
        if (selectedRMDInvestmentsOrder.length < RMDInvestments) {
            selectedRMDInvestmentsOrder.push('')
        }
       
        setSelectedExpensesOrder((prev) => {
            const updatedOrder = [
                ...selectedExpensesOrder,                     
                ...prev.slice(expenseCount)   
            ];
            return updatedOrder;
        });
        while(selectedExpensesOrder.length > expenseCount) {
            selectedExpensesOrder.pop()
        }
        if (selectedExpensesOrder.length < expenseCount) {
            selectedExpensesOrder.push('')
        }        

    }, [user, expenseWithdrawlInvestmentsCount, RMDInvestments, expenseCount]); 

    const handleCheckboxChange = (id) => {
        setRothInvestments((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id) 
                : [...prev, id]                      
        );
    };
    
    const handleInvestmentTypeCheckbox = (investmentType) => {
        setSelectedInvestmentTypes((prev) =>
            prev.includes(investmentType._id)
                ? prev.filter((item) => item !== investmentType._id) 
                : [...prev, investmentType._id]                      
        );
    }
    const handleEventCheckbox = (event) => {
        setSelectedEvents((prev) =>
            prev.includes(event._id)
                ? prev.filter((item) => item !== event._id) 
                : [...prev, event._id]                      
        );
    }

    const handleInvestmentCheckbox = (investment) => {
        setSelectedInvestments((prev) =>
            prev.includes(investment._id)
                ? prev.filter((item) => item !== investment._id) 
                : [...prev, investment._id]                      
        );
    }

    const handleSubmit = async () => {
        try {
            let scenario = {
                name: name,
                maritalStatus: isMarried === "yes" ? "couple" : "individual",
                birthYears: isMarried === "yes" ? [Number(userBirthYear), Number(spouseBirthYear)] : [Number(userBirthYear)],
                lifeExpectancy: isMarried === "yes" ? 
                [userLifeExpectancyDistribution === "fixed" ? 
                    {
                        type: "fixed",
                        value: Number(userLifeExpectancyMean)
                    } 
                    : 
                    {
                        type: "normalDistribution",
                        mean: Number(userLifeExpectancyMean),
                        stdev: Number(userLifeExpectancyDeviation)
                    }, 
                 spouseLifeExpectancyDistribution === "fixed" ? 
                    {
                        type: "fixed",
                        value: Number(spouseLifeExpectancyFixed)
                    } 
                    : 
                    {
                        type: "normalDistribution",
                        mean: Number(spouseLifeExpectancyMean),
                        stdev: Number(spouseLifeExpectancyDeviation)
                    }
                ] 
                : 
                [userLifeExpectancyDistribution === "fixed" ? 
                    {
                        type: "fixed",
                        value: Number(userLifeExpectancyFixed)
                    } 
                    : 
                    {
                        type: "normalDistribution",
                        mean: Number(userLifeExpectancyMean),
                        stdev: Number(userLifeExpectancyDeviation)
                    }
                ],
                investmentTypes: selectedInvestmentTypes,
                investments: selectedInvestments,
                eventSeries: selectedEvents,
                inflationAssumption: inflationAssumption === "fixed" ? 
                {
                    type: inflationAssumption,
                    value: Number(fixedIncomeAmount)
                } 
                : 
                inflationAssumption === "normalDistribution" ? 
                {
                    type: inflationAssumption,
                    mean: Number(incomeMean),
                    stdev: Number(incomeDeviation)
                } : 
                {
                    type: inflationAssumption,
                    lower: Number(uniformLower),
                    upper: Number(uniformUpper)
                },
                afterTaxContributionLimit: Number(limitOnAnnualContributions),
                spendingStrategy: selectedExpensesOrder.map((name) => events.find((event) => event.name === name)._id),
                expenseWithdrawalStrategy: selectedInvestmentsOrder.map((id) => listofinvestments.find((investment) => investment.id === id)._id),
                RMDStrategy: selectedRMDInvestmentsOrder.map((id) => listofinvestments.find((investment) => investment.id === id)._id),
                RothConversionOpt: rothConversionStrategy === "yes" ? true : false,
                RothConversionStart: Number(rothConversionStartYear),
                RothConversionEnd: Number(rothConversionEndYear),
                RothConversionStrategy: rothInvestments.map((id) => listofinvestments.find((investment) => investment.id === id)._id),
                sharingSettings: sharingSettings,
                financialGoal: Number(financialGoal),
                residenceState: stateOfResidence,
            }

            if (scenario.expenseWithdrawalStrategy !== undefined && scenario.expenseWithdrawalStrategy.includes('')) {
                setEmptyExpenseStrategyError(<div style={{color: "red"}}>Please select options for all investments!</div>)
                return
            }
            else {
                setEmptyExpenseStrategyError(<div></div>)
            }

            const response = await axios.post('http://localhost:8000/submitScenario', {
                scenario : scenario, user: user
            });

            window.location.reload();
            
        } catch (error) {
            console.error("Error submitting scenario:", error);
        }
    };
    const handleCheckState = async () => {
        try {
            const response = await axios.get('http://localhost:8000/checkState', {
                params: { state: stateOfResidence.trim().toUpperCase(), userId: user._id }, 
              });
          if (response.data.exists) {
            setStateExists(true);
            setMessage('State tax information found in database. Proceeding with save...');
            handleSubmit();
          } else {
            setStateExists(false);
            setShowUploadModal(true); 
          }
        } catch (error) {
          console.error('Error checking state:', error);
        }
      };
    
      const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post('http://localhost:8000/uploadStateTax', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { userId: user._id } 
            });
    
            setMessage('State tax data uploaded successfully, continuing with save');
            setStateExists(true);
            setShowUploadModal(false);
            handleSubmit();
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file.');
        }
    };

    return (
        <div>
            <div style={{width: '100%', marginLeft: '75px', marginRight: '75px',}}>
                <div className="form-div" style={{display: 'flex', alignContent: 'center', flexDirection: 'column',  marginTop: '30px'}}>
                    <div>
                        <h1 className='form-title'>Scenarios</h1>
                    </div> 
                    {/* Name Section */}
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
                    {/* Is Married */} 
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Married</div>
                            <FormControl>
                                <RadioGroup
                                row
                                name="married?"
                                value={isMarried}
                                onChange={(e) => {setUserLifeExpectancyDistribution("");setSpouseLifeExpectancyDistribution("");setIsMarried(e.target.value);}}
                                >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes"/>
                                <FormControlLabel value="no" control={<Radio />} label="No"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div> 
                    {/* Is Married Options */} 
                    {isMarried === "yes" && 
                    <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>User Birth Year</div>
                                <TextField 
                                    label="Birth Year"
                                    onChange={(e) => setUserBirthYear(e.target.value)}
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
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Life Expectancy Distribution</div>
                                <FormControl fullWidth size="small" sx={{flex: 1}}>
                                    <InputLabel>Select an Option</InputLabel>
                                    <Select 
                                    onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}
                                    value={userLifeExpectancyDistribution}
                                    label="Select Option"
                                    >
                                    <MenuItem value="fixed">Fixed</MenuItem>
                                    <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {userLifeExpectancyDistribution === "fixed" && 
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                                <TextField 
                                    label="Fixed Amount"
                                    onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}
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
                        {userLifeExpectancyDistribution === "normalDistribution" &&
                        <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                                <TextField 
                                    label="Mean"
                                    onChange={(e) => setUserLifeExpectancyMean(e.target.value)}
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
                                    onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}
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
                        </div>
                        }
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Spouse Birth Year</div>
                                <TextField 
                                    label="Birth Year"
                                    onChange={(e) => setSpouseBirthYear(e.target.value)}
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
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Life Expectancy Distribution</div>
                                <FormControl fullWidth size="small" sx={{flex: 1}}>
                                    <InputLabel>Select an Option</InputLabel>
                                    <Select 
                                    onChange={(e) => setSpouseLifeExpectancyDistribution(e.target.value)}
                                    value={spouseLifeExpectancyDistribution}
                                    label="Select Option"
                                    >
                                    <MenuItem value="fixed">Fixed</MenuItem>
                                    <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {spouseLifeExpectancyDistribution === "fixed" && 
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                                <TextField 
                                    label="Fixed Amount"
                                    onChange={(e) => setSpouseLifeExpectancyFixed(e.target.value)}
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
                        {spouseLifeExpectancyDistribution === "normalDistribution" &&
                        <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                                <TextField 
                                    label="Mean"
                                    onChange={(e) => setSpouseLifeExpectancyMean(e.target.value)}
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
                                    onChange={(e) => setSpouseLifeExpectancyDeviation(e.target.value)}
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
                        </div>
                        }
                    </div>
                    
                    }
                    {isMarried === "no" && 
                    <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>User Birth Year</div>
                                <TextField 
                                    label="Birth Year"
                                    onChange={(e) => setUserBirthYear(e.target.value)}
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
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Life Expectancy Distribution</div>
                                <FormControl fullWidth size="small" sx={{flex: 1}}>
                                    <InputLabel>Select an Option</InputLabel>
                                    <Select 
                                    onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}
                                    value={userLifeExpectancyDistribution}
                                    label="Select Option"
                                    >
                                    <MenuItem value="fixed">Fixed</MenuItem>
                                    <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {userLifeExpectancyDistribution === "fixed" && 
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                                <TextField 
                                    label="Fixed Amount"
                                    onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}
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
                        {userLifeExpectancyDistribution === "normalDistribution" &&
                        <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Mean</div>
                                <TextField 
                                    label="Mean"
                                    onChange={(e) => setUserLifeExpectancyMean(e.target.value)}
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
                                    onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}
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
                        </div>
                        }
                    </div>
                    }
                    {/*User Investment Types*/ }
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>User Investment Types</div>
                            {investments.length > 0 ? (
                                <ul>
                                    {investments.map((investment) => (
                                        <div key={investment._id}>
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={selectedInvestmentTypes.includes(investment._id)}
                                                onChange={() => handleInvestmentTypeCheckbox(investment)}
                                                />
                                            }
                                            label={investment.name}
                                            />
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <div className='form-text' >***No Investment Types Found***</div>
                            )}
                        </div>
                    </div>
                    {/*User Event Types*/}
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>User Event Types</div>
                            {events.length > 0 ? (
                                <ul>
                                    {events.map((event) => (
                                        <div key={event._id}>
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={selectedEvents.includes(event._id)}
                                                onChange={() => handleEventCheckbox(event)}
                                                />
                                            }
                                            label={event.name}
                                            />
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <div className='form-text' >***No Events Found***</div>
                            )}
                        </div>
                    </div>
                    {/*User Investments*/}
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Investments</div>
                            {listofinvestments.length > 0 ? (
                                <ul>
                                    {listofinvestments.map((investment) => (
                                        <div key={investment._id}>
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={selectedInvestments.includes(investment._id)}
                                                onChange={() => handleInvestmentCheckbox(investment)}
                                                />
                                            }
                                            label={investment.id}
                                            />
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <div className='form-text' >***No Investments Found***</div>
                            )}
                        </div>
                    </div>
                    {/*Inflation Adjustment*/}
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Inflation Adjustment</div>
                            <FormControl fullWidth size="small" sx={{flex: 1}}>
                                <InputLabel>Select an Option</InputLabel>
                                <Select 
                                onChange={(e) => setInflationAssumption(e.target.value)}
                                value={inflationAssumption}
                                label="Select Option"
                                >
                                <MenuItem value="fixed">Fixed</MenuItem>
                                <MenuItem value="normalDistribution">Normal Distribution</MenuItem>  
                                <MenuItem value="uniformDistribution">Uniform Distribution</MenuItem>  
                                </Select>
                            </FormControl>
                        </div>
                        {inflationAssumption === "fixed" && 
                            <div>
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Enter Fixed Amount</div>
                                    <TextField 
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
                        {inflationAssumption === "normalDistribution" &&
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
                        </div>
                        }
                        {inflationAssumption === "uniformDistribution" &&
                        <div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Upper Limit</div>
                                <TextField 
                                    label="Upper Limit"
                                    onChange={(e) => setUniformLower(e.target.value)}
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
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Lower Limit</div>
                                <TextField 
                                    label="Lower Limit"
                                    onChange={(e) => setUniformUpper(e.target.value)}
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
                        </div>
                        }
                    </div>
                    {/*Initial Limit on Annual Contribtion*/ }
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Initial Limit on Annual Contributions to After-tax Retirement Accounts</div>
                            <TextField 
                                label="Inital Limit"
                                onChange={(e) => setLimitOnAnnualContributions(e.target.value)}
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
                    {/*Spending Strategy*/}
                    <div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Spending Strategy</div>
                        </div>
                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Number of Expenses</div>
                            <TextField 
                                type='number'
                                value={expenseCount}
                                onChange={(e) => setExpenseCount(Number(e.target.value) || 0)}
                                inputProps={{ min: 0 }}
                                variant="outlined"
                                size="small"
                                sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                                }}
                            />
                            
                        </div>
                        <div >
                            <ul>
                                {Array.from({ length: expenseCount }, (_, i) => (
                                    <div key={i}>
                                        <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                            <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expense {i+1}</div>
                                            <FormControl fullWidth size="small" sx={{flex: 1}}>
                                                <InputLabel>Select an Option</InputLabel>
                                                <Select 
                                                onChange={(e) => setInflationAssumption(e.target.value)}
                                                value={inflationAssumption}
                                                label="Select Option"
                                                >
                                                <MenuItem>Please Select an Option</MenuItem>
                                                {events.filter((event) => event.discretionary === true && selectedEvents.includes(event._id)).map((event) => (
                                                    <MenuItem value={event.name}>{event.name}</MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        
                                    </div>
                                
                                ))}
                            </ul>
                        </div>
                        {/*Expense Withdrawl Strategy */}
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Expense Withdrawl Strategy</div>
                            </div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Number of Investments</div>
                                <TextField 
                                    type='number'
                                    value={expenseWithdrawlInvestmentsCount}
                                    onChange={(e) => setExpenseWithdrawlInvestmentsCount(Number(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                    }}
                                />
                                
                            </div>
                            <div >
                                <ul>
                                    {Array.from({ length: expenseWithdrawlInvestmentsCount }, (_, i) => (
                                        <div key={i}>
                                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Investment {i+1}</div>
                                                <FormControl fullWidth size="small" sx={{flex: 1}}>
                                                    <InputLabel>Select an Option</InputLabel>
                                                    <Select 
                                                    onChange={(e) => selectedInvestmentsOrder[i] = e.target.value}
                                                    value={selectedInvestmentsOrder[i] || ''}
                                                    label="Select Option"
                                                    >
                                                    <MenuItem>Please Select an Option</MenuItem>
                                                    {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment) => (
                                                        <MenuItem value={investment.id} key={investment._id}>{investment.id}</MenuItem>
                                                    ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            
                                        </div>
                                    
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/*RMD Strategy */}
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>RMD Strategy</div>
                            </div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Number of Pre-Tax Investments</div>
                                <TextField 
                                    type='number'
                                    value={RMDInvestments}
                                    onChange={(e) => setRMDInvestments(Number(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                    }}
                                />
                                
                            </div>
                            <div >
                                <ul>
                                    {Array.from({ length: RMDInvestments }, (_, i) => (
                                        <div key={i}>
                                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Pre-Tax Investment {i+1}</div>
                                                <FormControl fullWidth size="small" sx={{flex: 1}}>
                                                    <InputLabel>Select an Option</InputLabel>
                                                    <Select 
                                                    onChange={(e) => selectedRMDInvestmentsOrder[i] = e.target.value}
                                                    value={selectedRMDInvestmentsOrder[i] || ''}
                                                    label="Select Option"
                                                    >
                                                    <MenuItem>Please Select an Option</MenuItem>  
                                                    {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment, index) => (
                                                        investment.taxStatus === 'pre-tax' && (
                                                            <MenuItem value={investment.id} key={index}>{investment.id}</MenuItem>
                                                        )
                                                    ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            
                                        </div>
                                    
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/*Roth Conversion Strategy */}
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Roth Conversion Strategy</div>
                                <FormControl>
                                    <RadioGroup
                                    row
                                    name="rothconversionstrategy"
                                    value={rothConversionStrategy}
                                    onChange={(e) => setRothConversionStrategy(e.target.value)}
                                    >
                                    <FormControlLabel value="yes" control={<Radio />} label="On"/>
                                    <FormControlLabel value="no" control={<Radio />} label="Off"/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        {/*Roth Conversion Settings */}
                        {rothConversionStrategy === "yes" && 
                        <div>
                            <div>
                                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Start Year</div>
                                    <TextField 
                                        label="Start Year"
                                        onChange={(e) => setRothConversionStartYear(e.target.value)} 
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
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>End Year</div>
                                    <TextField 
                                        label="End Year"
                                        onChange={(e) => setRothConversionEndYear(e.target.value)}
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
                                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Investments</div>
                                    {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment, index) => (
                                        investment.taxStatus === 'pre-tax' && (
                                            <div key={index}>
                                                    <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                        checked={rothInvestments.includes(investment._id)}
                                                        onChange={() => handleCheckboxChange(investment.id)}
                                                        />
                                                    }
                                                    label={investment.name}
                                                    />
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                        </div>
                        }
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Sharing Strategy</div>
                                <FormControl>
                                    <RadioGroup
                                    row
                                    name="sharingsettings"
                                    value={sharingSettings}
                                    onChange={(e) => setSharingSettings(e.target.value)}
                                    >
                                    <FormControlLabel value="read-only" control={<Radio />} label="Read-Only"/>
                                    <FormControlLabel value="read-write" control={<Radio />} label="Read-Write"/>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div>
                            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Financial Goal</div>
                                <TextField 
                                    label="Financial Goal"
                                    onChange={(e) => setFinancialGoal(e.target.value)}
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
                                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>State of Residence</div>
                                <TextField 
                                    label="State"
                                    onChange={(e) => setStateOfResidence(e.target.value)}
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
                            <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={handleCheckState}>Create</button>
                        </div>
                        
                    </div>

                </div>
            </div>


            


            

            {showUploadModal && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
          <h3>State Not Found</h3>
          <p>Please upload a YAML file with tax information for {stateOfResidence}.</p>
          <input
            type="file"
            accept=".yaml,.yml"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleFileUpload}>Upload YAML</button>
          <button onClick={() => setShowUploadModal(false)}>Cancel</button>
        </div>
      )}

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default ScenerioForm;
