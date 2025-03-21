import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from "../store/Store";

const ScenerioForm = (props) => {
    const { user } = useContext(StoreContext);
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
    const [inflationAssumption, setInflationAssumption] = useState()
    const [fixedIncomeAmount, setFixedIncomeAmount] = useState()
    const [incomeMean, setIncomeMean] = useState()
    const [incomeDeviation, setIncomeDeviation] = useState()
    const [uniformLower, setUniformLower] = useState()
    const [uniformUpper, setUniformUpper] = useState()
    const [limitOnAnnualContributions, setLimitOnAnnualContributions] = useState()
    const [spendingStrategy, setSpendingStrategy] = useState()
    const [expenseWithdrawlStrategy, setExpenseWithdrawlStrategy] = useState()
    const [RMDStrategy, setRMDStrategy] = useState()
    const [rothConversionStrategy, setRothConversionStrategy] = useState()
    const [rothConvesionOptimizerSettings, setRothConversionOptimizerSettings] = useState()
    const [rothConversionStartYear, setRothConversionStartYear] = useState()
    const [rothConversionEndYear, setRothConversionEndYear] = useState()
    const [sharingSettings, setSharingSettings] = useState()
    const [financialGoal, setFinancialGoal] = useState()
    const [stateOfResidence, setStateOfResidence] = useState()
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
        setSelectedInvestmentsOrder(Array(expenseWithdrawlInvestmentsCount).fill(listofinvestments.length === 0 ? "" : listofinvestments[0].id));
        setSelectedRMDInvestmentsOrder(Array(RMDInvestments).fill(listofinvestments.length === 0 ? "" : listofinvestments.filter((investment) => investment.taxStatus === 'pre-tax')[0].id));
        setSelectedExpensesOrder(Array(expenseCount).fill(events.length === 0 ? "" : events.filter((event) => event.discretionary === true)[0].name));

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
            let scenerio = {
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
            
        } catch (error) {
            console.error("Error submitting scenerio:", error);
        }
    };

    return (
        <div>
            <h1>Scenerio</h1>

            <div>
                <span>Name</span>
                <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <span>Married?</span>
                <label><input type="radio" name="married" value="yes" onChange={(e) => {setUserLifeExpectancyDistribution("");setSpouseLifeExpectancyDistribution("");setIsMarried(e.target.value);}} />Yes</label>
                <label><input type="radio" name="married" value="no" onChange={(e) => {setUserLifeExpectancyDistribution("");setSpouseLifeExpectancyDistribution("");setIsMarried(e.target.value);}} />No</label>
            </div>

           {isMarried === "yes" && 
                <div>
                    <div>
                        <span>User Birth Year</span>
                        <input type="text" onChange={(e) => setUserBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>
                    {userLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {userLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}></input>
                    </div>
                    </div>
                    }

                    <div>
                        <span>Spouse Birth Year</span>
                        <input type="text" onChange={(e) => setSpouseBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select onChange={(e) => setSpouseLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>
                    {spouseLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input type="text" onChange={(e) => setSpouseLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {spouseLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input type="text" onChange={(e) => setSpouseLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input type="text" onChange={(e) => setSpouseLifeExpectancyDeviation(e.target.value)}></input>
                    </div>
                    </div>
                    }
                </div>
           
           }

            {isMarried === "no" && 
                <div>
                    <div>
                        <span>User Birth Year</span>
                        <input type="text" onChange={(e) => setUserBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>
                    {userLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {userLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input type="text" onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}></input>
                    </div>
                    </div>
                    }
                </div>
           }


            <div>
                <span>User Investment Types:</span>
                {investments.length > 0 ? (
                    <ul>
                        {investments.map((investment) => (
                            <div>
                                <label><input onChange={() => handleInvestmentTypeCheckbox(investment)} type="checkbox" />{investment.name}</label>
                                
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No investments found.</p>
                )}
            </div>

            <div>
                <span>User Event Types:</span>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <div>
                                <label><input onChange={() => handleEventCheckbox(event)}type="checkbox" />{event.name}</label>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>

            <div>
                <span>Investments:</span>
                {listofinvestments.length > 0 ? (
                    <ul>
                        {listofinvestments.map((investment) => (
                            <div>
                                <label><input onChange={() => handleInvestmentCheckbox(investment)}type="checkbox" />{investment.id}</label>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>

            <div>
                <span>Inflation Assumption</span>
                <select onChange={(e) => setInflationAssumption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed percentage</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    <option value="uniformDistribution">Uniform Distribution</option>
                </select>
                {inflationAssumption === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input type="text" onChange={(e) => setFixedIncomeAmount(e.target.value)}></input>
                    </div>
                }
                {inflationAssumption === "normalDistribution" &&
                <div>
                <div>
                    <span>Mean</span>
                    <input type="text" onChange={(e) => setIncomeMean(e.target.value)}></input>
                </div>
                <div>
                    <span>Standard Deviation</span>
                    <input type="text" onChange={(e) => setIncomeDeviation(e.target.value)}></input>
                </div>
                </div>
                }
                {inflationAssumption === "uniformDistribution" &&
                <div>
                <div>
                    <span>Upper</span>
                    <input type="text" onChange={(e) => setUniformLower(e.target.value)}></input>
                </div>
                <div>
                    <span>Lower</span>
                    <input type="text" onChange={(e) => setUniformUpper(e.target.value)}></input>
                </div>
                </div>
                }
            </div>

            <div>
                <span>Initial Limit on Annual Contributions to After-tax Retirement Accounts</span>
                <input type="text" onChange={(e) => setLimitOnAnnualContributions(e.target.value)} />
            </div>

            <div>
                <span>Spending Strategy</span>
                <br />
                <span>Number of expenses:</span>
                <input
                    type="number"
                    min="0"
                    value={expenseCount}
                    onChange={(e) => setExpenseCount(Number(e.target.value) || 0)}
                />
                <ul>
                    {Array.from({ length: expenseCount }, (_, i) => (
                        <div>
                            <h3>{i + 1}</h3>
                            <select onChange={(e) => selectedExpensesOrder[i] = e.target.value}>
                                {events.filter((event) => event.discretionary === true && selectedEvents.includes(event._id)).map((event) => (
                                    <option>{event.name}</option>
                                ))}
                            </select>
                        </div>
                    
                    ))}
                </ul>
            </div>

            <div>
                <span>Expense Withdrawl Strategy</span>
                <br />
                <span>Number of investments:</span>
                <input
                    type="number"
                    min="0"
                    value={expenseWithdrawlInvestmentsCount}
                    onChange={(e) => setExpenseWithdrawlInvestmentsCount(Number(e.target.value) || 0)}
                />
                <ul>
                    {Array.from({ length: expenseWithdrawlInvestmentsCount }, (_, i) => (
                        <div>
                            <h3>{i + 1}</h3>
                            <select onChange={(e) => selectedInvestmentsOrder[i] = e.target.value}>
                                {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment) => (
                                    <option>{investment.id}</option>
                                ))}
                            </select>
                        </div>
                    
                    ))}
                </ul>
            </div>
            
            <div>
                <span>RMD Strategy</span>
                <br />
                <span>Number of pre-tax investments:</span>
                <input
                    type="number"
                    min="0"
                    value={RMDInvestments}
                    onChange={(e) => setRMDInvestments(Number(e.target.value) || 0)}
                />
                <ul>
                    {Array.from({ length: RMDInvestments }, (_, i) => (
                        <div>
                            <h3>{i + 1}</h3>
                            <select onChange={(e) => selectedRMDInvestmentsOrder[i] = e.target.value}>
                                {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment, index) => (
                                    investment.taxStatus === 'pre-tax' && (
                                        <option key={index}>{investment.id}</option>
                                    )
                                ))}
                            </select>
                        </div>
                    ))}
                </ul>
            </div>

            <div>
                <span>Roth conversion Strategy</span>
                <label><input type="radio" name="rothconversionstrategy" value="yes" onChange={(e) => setRothConversionStrategy(e.target.value)} />On</label>
                <label><input type="radio" name="rothconversionstrategy" value="no" onChange={(e) => setRothConversionStrategy(e.target.value)} />Off</label>
            </div>

            {rothConversionStrategy === "yes" && 
            <div>
                <div>
                    <span>Start year</span>
                    <input type="text" onChange={(e) => setRothConversionStartYear(e.target.value)} />
                </div>

                <div>
                    <span>End year</span>
                    <input type="text" onChange={(e) => setRothConversionEndYear(e.target.value)} />
                </div>

                <div>
                <span>Investments:</span>
                <br></br>
                {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment, index) => (
                    investment.taxStatus === 'pre-tax' && (
                        <div>
                        <label key={index}><input type="checkbox" onChange={() => handleCheckboxChange(investment.id)}/>{investment.id}</label>
                        <br></br>
                        </div>
                    )
                ))}
                
                

                
            </div>
            </div>
            }

            <div>
                <span>Sharing settings</span>
                <label><input type="radio" name="sharingsettings" value="read-only" onChange={(e) => setSharingSettings(e.target.value)}/>Read-only</label>
                <label><input type="radio" name="sharingsettings" value="read-write"onChange={(e) => setSharingSettings(e.target.value)} />Read-write</label>
                
            </div>

            <div>
                <span>Financial Goal</span>
                <input type="text" onChange={(e) => setFinancialGoal(e.target.value)} />
            </div>

            <div>
                <span>State of residence</span>
                <input type="text" onChange={(e) => setStateOfResidence(e.target.value)} />
            </div>

            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default ScenerioForm;
