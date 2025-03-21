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
    }, [user]); 

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
                investmentTypes: investments.map((investmentType) => investmentType._id),
                investments: listofinvestments.map((investment) => investment._id),
                eventSeries: events.map((event) => event._id),
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
                spendingStrategy: [],
                expenseWithdrawalStrategy: [],
                RMDStrategy: [],
                RothConversionOpt: rothConversionStrategy,
                RothConversionStart: rothConversionStartYear,
                RothConversionEnd: rothConversionEndYear,
                RothConversionStrategy: [],
                sharingSettings: sharingSettings,
                financialGoal: financialGoal,
                residenceState: stateOfResidence,
            }

            console.log(scenerio)
           
            
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
                                <li key={investment._id}>{investment.name}</li>
                                <button>add to scenerio</button>
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
                            <li key={event._id}>{event.name}</li>
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
                            <select>
                                (<option>expense 1</option>
                                <option>expense 2</option>
                                <option>expense 3</option>
                                <option>expense 4</option>)
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
                            <select>
                                {listofinvestments.map((investment) => (
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
                            <select>
                                {listofinvestments.map((investment, index) => (
                                    investment.taxStatus === 'pretax' && (
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
                <span>List of investments identified by id</span>
                <input type="text"/>

                
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
