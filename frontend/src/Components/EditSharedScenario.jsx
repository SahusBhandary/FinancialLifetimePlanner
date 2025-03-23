import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const EditSharedScenario = (props) => {

    let [user, setUser] = useState(props.tempUser)
    useEffect(() => {
    const fetchUser = async () => {
      if (props.tempUser instanceof Promise) {
        const data = await props.tempUser;  // await the Promise
        setUser(data);
      } else {
        setUser(props.tempUser);  // directly set if it's already resolved
      }
    };

    fetchUser();
  }, [props.tempUser]);
    const [ emptyExpenseStrategyError, setEmptyExpenseStrategyError ] = useState()
    const [name, setName] = useState(props.scenario.name);
    const [isMarried, setIsMarried] = useState(props.scenario.maritalStatus === "couple" ? "yes" : "no");
    const [userBirthYear, setUserBirthYear] = useState(props.scenario.birthYears[0]);
    const [spouseBirthYear, setSpouseBirthYear] = useState(props.scenario.birthYears.length === 2 ? props.scenario.birthYears[1] : "");
    const [userLifeExpectancyDistribution, setUserLifeExpectancyDistribution] = useState(props.scenario.lifeExpectancy[0].type);
    const [userLifeExpectancyFixed, setUserLifeExpectancyFixed] = useState(props.scenario.lifeExpectancy[0].value);
    const [userLifeExpectancyMean, setUserLifeExpectancyMean] = useState(props.scenario.lifeExpectancy[0].mean);
    const [userLifeExpectancyDeviation, setUserLifeExpectancyDeviation] = useState(props.scenario.lifeExpectancy[0].stdev);
    const [spouseLifeExpectancyDistribution, setSpouseLifeExpectancyDistribution] = useState(props.scenario.lifeExpectancy.length === 2 ? props.scenario.lifeExpectancy[1].type : "");
    const [spouseLifeExpectancyFixed, setSpouseLifeExpectancyFixed] = useState(props.scenario.lifeExpectancy.length === 2 ? props.scenario.lifeExpectancy[1].value : "" );
    const [spouseLifeExpectancyMean, setSpouseLifeExpectancyMean] = useState(props.scenario.lifeExpectancy.length === 2 ? props.scenario.lifeExpectancy[1].mean : "");
    const [spouseLifeExpectancyDeviation, setSpouseLifeExpectancyDeviation] = useState(props.scenario.lifeExpectancy.length === 2 ? props.scenario.lifeExpectancy[1].stdev : "");
    const [investments, setInvestments] = useState([]); 
    const [events, setEvents] = useState([]); 
    const [inflationAssumption, setInflationAssumption] = useState(props.scenario.inflationAssumption.type)
    const [fixedIncomeAmount, setFixedIncomeAmount] = useState(props.scenario.inflationAssumption.value)
    const [incomeMean, setIncomeMean] = useState(props.scenario.inflationAssumption.mean)
    const [incomeDeviation, setIncomeDeviation] = useState(props.scenario.inflationAssumption.stdev)
    const [uniformLower, setUniformLower] = useState(props.scenario.inflationAssumption.lower)
    const [uniformUpper, setUniformUpper] = useState(props.scenario.inflationAssumption.upper)
    const [limitOnAnnualContributions, setLimitOnAnnualContributions] = useState(props.scenario.afterTaxContributionLimit)
    const [spendingStrategy, setSpendingStrategy] = useState()
    const [expenseWithdrawlStrategy, setExpenseWithdrawlStrategy] = useState()
    const [RMDStrategy, setRMDStrategy] = useState()
    const [rothConversionStrategy, setRothConversionStrategy] = useState(props.scenario.RothConversionOpt ? "yes" : "no")
    const [rothConvesionOptimizerSettings, setRothConversionOptimizerSettings] = useState()
    const [rothConversionStartYear, setRothConversionStartYear] = useState(props.scenario.RothConversionStart)
    const [rothConversionEndYear, setRothConversionEndYear] = useState(props.scenario.RothConversionEnd)
    const [sharingSettings, setSharingSettings] = useState(props.scenario.sharingSettings)
    const [financialGoal, setFinancialGoal] = useState(props.scenario.financialGoal)
    const [stateOfResidence, setStateOfResidence] = useState(props.scenario.residenceState)
    const [expenseCount, setExpenseCount] = useState(events.filter((event) => event.discretionary === true && props.scenario.eventSeries.includes(event._id)).length);
    const [expenseWithdrawlInvestmentsCount, setExpenseWithdrawlInvestmentsCount] = useState(props.scenario.expenseWithdrawalStrategy.length);
    const [RMDInvestments, setRMDInvestments] = useState(0);
    const [listofinvestments, setListOfInvestments] = useState([])
    const [selectedExpensesOrder, setSelectedExpensesOrder] = useState([]);
    let [selectedInvestmentsOrder, setSelectedInvestmentsOrder] = useState(props.scenario.expenseWithdrawalStrategy);
    const [selectedRMDInvestmentsOrder, setSelectedRMDInvestmentsOrder] = useState([]);
    const [selectedInvestments, setSelectedInvestments] = useState(props.scenario.investments);
    const [rothInvestments, setRothInvestments] = useState(props.scenario.RothConversionStrategy);
    const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState(props.scenario.investmentTypes);
    const [selectedEvents, setSelectedEvents] = useState(props.scenario.eventSeries);
    
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
        setSelectedInvestmentsOrder(Array(expenseWithdrawlInvestmentsCount).fill(listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).length === 0 ? "" : listofinvestments.filter((investment) => selectedInvestments.includes(investment._id))[0]._id));
        setSelectedRMDInvestmentsOrder(Array(RMDInvestments).fill(listofinvestments.filter((investment) => investment.taxStatus === 'pre-tax').length === 0 ? "" : listofinvestments.filter((investment) => investment.taxStatus === 'pre-tax')[0].id));
        setSelectedExpensesOrder(Array(expenseCount).fill(events.filter((event) => event.discretionary === true).length === 0 ? "" : events.filter((event) => event.discretionary === true)[0].name));
    }, [user, expenseWithdrawlInvestmentsCount, RMDInvestments, expenseCount, props.scenario]); 

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
                expenseWithdrawalStrategy: selectedInvestmentsOrder,
                RMDStrategy: selectedRMDInvestmentsOrder.map((id) => listofinvestments.find((investment) => investment.id === id)._id),
                RothConversionOpt: rothConversionStrategy === "yes" ? true : false,
                RothConversionStart: Number(rothConversionStartYear),
                RothConversionEnd: Number(rothConversionEndYear),
                RothConversionStrategy: rothInvestments,
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

            const response = await axios.post('http://localhost:8000/editScenario', {
                scenario : scenario,
                scenarioID: props.scenario._id
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
            <h1>{props.scenario.name}</h1>

            <div>
                <span>Name</span>
                <input defaultValue={name} type="text" onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <span>Married?</span>
                <label><input checked={isMarried === "yes"}type="radio" name="married" value="yes" onChange={(e) => {setIsMarried(e.target.value);}} />Yes</label>
                <label><input checked={isMarried === "no"}type="radio" name="married" value="no" onChange={(e) => {setIsMarried(e.target.value);}} />No</label>
            </div>

           {isMarried === "yes" && 
                <div>
                    <div>
                        <span>User Birth Year</span>
                        <input defaultValue={userBirthYear}type="text" onChange={(e) => setUserBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select defaultValue={userLifeExpectancyDistribution} value={userLifeExpectancyDistribution}  onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>

                    {userLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input defaultValue={userLifeExpectancyFixed} type="text" onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {userLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input defaultValue={userLifeExpectancyMean}type="text" onChange={(e) => setUserLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input defaultValue={userLifeExpectancyDeviation}type="text" onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}></input>
                    </div>
                    </div>
                    }

                    <div>
                        <span>Spouse Birth Year</span>
                        <input defaultValue={spouseBirthYear} type="text" onChange={(e) => setSpouseBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select defaultValue={spouseLifeExpectancyDistribution} onChange={(e) => setSpouseLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>
                    {spouseLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                    
                        <input defaultValue={spouseLifeExpectancyFixed}type="text" onChange={(e) => setSpouseLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {spouseLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input defaultValue={spouseLifeExpectancyMean} type="text" onChange={(e) => setSpouseLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input defaultValue={spouseLifeExpectancyDeviation} type="text" onChange={(e) => setSpouseLifeExpectancyDeviation(e.target.value)}></input>
                    </div>
                    </div>
                    }
                </div>
           
           }

            {isMarried === "no" && 
                <div>
                    <div>
                        <span>User Birth Year</span>
                        <input defaultValue={userBirthYear} type="text" onChange={(e) => setUserBirthYear(e.target.value)} />
                    </div>

                    <span>Life Expectancy Distribution</span>
                    <select defaultValue={userLifeExpectancyDistribution} onChange={(e) => setUserLifeExpectancyDistribution(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    </select>
                    {userLifeExpectancyDistribution === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input defaultValue={userLifeExpectancyFixed}type="text" onChange={(e) => setUserLifeExpectancyFixed(e.target.value)}></input>
                    </div>
                    }
                    {userLifeExpectancyDistribution === "normalDistribution" &&
                    <div>
                    <div>
                        <span>Mean</span>
                        <input defaultValue={userLifeExpectancyMean}type="text" onChange={(e) => setUserLifeExpectancyMean(e.target.value)}></input>
                    </div>
                    <div>
                        <span>Standard Deviation</span>
                        <input defaultValue={userLifeExpectancyDeviation} type="text" onChange={(e) => setUserLifeExpectancyDeviation(e.target.value)}></input>
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
                                <label><input checked={selectedInvestmentTypes.includes(investment._id) }onChange={() => handleInvestmentTypeCheckbox(investment)} type="checkbox" />{investment.name}</label>
                                
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
                                <label><input checked={selectedEvents.includes(event._id)}onChange={() => handleEventCheckbox(event)}type="checkbox" />{event.name}</label>
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
                                <label><input checked={selectedInvestments.includes(investment._id)}onChange={() => handleInvestmentCheckbox(investment)}type="checkbox" />{investment.id}</label>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>

            <div>
                <span>Inflation Assumption</span>
                <select defaultValue={inflationAssumption}onChange={(e) => setInflationAssumption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed percentage</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    <option value="uniformDistribution">Uniform Distribution</option>
                </select>
                {inflationAssumption === "fixed" && 
                    <div>
                        <span>Enter Fixed Amount</span>
                        <input defaultValue={fixedIncomeAmount} type="text" onChange={(e) => setFixedIncomeAmount(e.target.value)}></input>
                    </div>
                }
                {inflationAssumption === "normalDistribution" &&
                <div>
                <div>
                    <span>Mean</span>
                    <input defaultValue={incomeMean} type="text" onChange={(e) => setIncomeMean(e.target.value)}></input>
                </div>
                <div>
                    <span>Standard Deviation</span>
                    <input defaultValue={incomeDeviation} type="text" onChange={(e) => setIncomeDeviation(e.target.value)}></input>
                </div>
                </div>
                }
                {inflationAssumption === "uniformDistribution" &&
                <div>
                <div>
                    <span>Upper</span>
                    <input defaultValue={uniformUpper} type="text" onChange={(e) => setUniformLower(e.target.value)}></input>
                </div>
                <div>
                    <span>Lower</span>
                    <input defaultValue={uniformLower} type="text" onChange={(e) => setUniformUpper(e.target.value)}></input>
                </div>
                </div>
                }
            </div>

            <div>
                <span>Initial Limit on Annual Contributions to After-tax Retirement Accounts</span>
                <input defaultValue={limitOnAnnualContributions} type="text" onChange={(e) => setLimitOnAnnualContributions(e.target.value)} />
            </div>

            <div>
                <span>Spending Strategy</span>
                <br />
                <span>Number of expenses:</span>
                <input
                    type="number"
                    min="0"
                    value={expenseCount}
                    defaultValue={expenseCount}
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
                    defaultValue={expenseWithdrawlInvestmentsCount}
                    onChange={(e) => setExpenseWithdrawlInvestmentsCount(Number(e.target.value) || 0)}
                />
                <ul>
                    {Array.from({ length: expenseWithdrawlInvestmentsCount }, (_, i) => (
                        <div>
                            <h3>{i + 1}</h3>
                            <select onChange={(e) => {
                                    const newOrder = [...selectedInvestmentsOrder];  
                                    newOrder[i] = e.target.value;                  
                                    setSelectedInvestmentsOrder(newOrder);
                                    selectedInvestmentsOrder = newOrder;
                                }}>
                                <option>Please select an option</option>
                                {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment) => (
                                    <option value={investment._id}>{investment.id}</option>
                                ))}
                            </select>
                        </div>
                    
                    ))}
                </ul>
                {emptyExpenseStrategyError}
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
                <label><input checked={rothConversionStrategy === "yes"} type="radio" name="rothconversionstrategy" value="yes" onChange={(e) => setRothConversionStrategy(e.target.value)} />On</label>
                <label><input checked={rothConversionStrategy === "no"} type="radio" name="rothconversionstrategy" value="no" onChange={(e) => setRothConversionStrategy(e.target.value)} />Off</label>
            </div>

            {rothConversionStrategy === "yes" && 
            <div>
                <div>
                    <span>Start year</span>
                    <input defaultValue={rothConversionStartYear} type="text" onChange={(e) => setRothConversionStartYear(e.target.value)} />
                </div>

                <div>
                    <span>End year</span>
                    <input defaultValue={rothConversionEndYear} type="text" onChange={(e) => setRothConversionEndYear(e.target.value)} />
                </div>

                <div>
                <span>Investments:</span>
                <br></br>
                {listofinvestments.filter((investment) => selectedInvestments.includes(investment._id)).map((investment, index) => (
                    investment.taxStatus === 'pre-tax' && (
                        <div>
                        <label key={index}><input checked={rothInvestments.includes(investment._id)} type="checkbox" onChange={() => handleCheckboxChange(investment._id)}/>{investment.id}</label>
                        <br></br>
                        </div>
                    )
                ))}
                
                

                
            </div>
            </div>
            }

            <div>
                <span>Sharing settings</span>
                <label><input checked={sharingSettings === "read-only"}type="radio" name="sharingsettings" value="read-only" onChange={(e) => setSharingSettings(e.target.value)}/>Read-only</label>
                <label><input checked={sharingSettings === "read-write"}type="radio" name="sharingsettings" value="read-write"onChange={(e) => setSharingSettings(e.target.value)} />Read-write</label>
                
            </div>

            <div>
                <span>Financial Goal</span>
                <input defaultValue={financialGoal}type="text" onChange={(e) => setFinancialGoal(e.target.value)} />
            </div>

            <div>
                <span>State of residence</span>
                <input defaultValue={stateOfResidence}type="text" onChange={(e) => setStateOfResidence(e.target.value)} />
            </div>

            <div>
                <button onClick={handleCheckState}>Submit</button>
            </div>
            <button onClick={() => {props.setIsEditPage(false); props.setIsSharedEditPage(false)}}> Back </button>
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

export default EditSharedScenario;
