import axios from 'axios';
import { useState, useEffect} from 'react';

const ViewScenario = (props) => { 
  let scenario = props.scenario;

  const [investments, setListOfInvestments] = useState(); // investments
  const [investmentTypes, setInvestments] = useState(); // investment types
  const [events, setEvents] = useState();

  const [spendingStrategyList, setSpendingStrategyList] = useState();
  const [expenseWithdrawalList, setExpenseWithdrawalList] = useState();
  const [RMDList, setRMDList] = useState();

  
  useEffect(() => {
    const fetchInvestmentType = async () => {
        if (scenario.investmentTypes.length > 0) {
            try {
                const response = await axios.post('http://localhost:8000/getInvestments', {
                    investmentIds: scenario.investmentTypes
                });

                setInvestments(response.data); 
            } catch (error) {
                console.error("Error fetching investment details:", error);
            }
        }
    };

    const fetchInvestments = async () => {
        if (scenario.investments.length > 0) {
            try {
                const response = await axios.post('http://localhost:8000/getInvestmentList', {
                    investmentIds: scenario.investments
                });
                
                setListOfInvestments(response.data); 
            
                
            } catch (error) {
                console.error("Error fetching investment details:", error);
            }
        }
    };

    const fetchEvents = async () => {
        if (scenario.eventSeries.length > 0) {
            try {
                const response = await axios.post('http://localhost:8000/getEvents', {
                    eventIds: scenario.eventSeries
                });

                setEvents(response.data); 
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        }
    };

    const fetchSpendingStrategy = async () => {
      if (scenario.spendingStrategy.length > 0) {
          try {
              const response = await axios.post('http://localhost:8000/getEvents', {
                  eventIds: scenario.spendingStrategy
              });

              setSpendingStrategyList(response.data); 
          } catch (error) {
              console.error("Error fetching spending strategy details:", error);
          }
      }
  };

  const fetchExpenseWithdrawalStrategy = async () => {
    if (scenario.expenseWithdrawalStrategy.length > 0) {
        try {
            const response = await axios.post('http://localhost:8000/getInvestmentList', {
              investmentIds: scenario.expenseWithdrawalStrategy
            });

            setExpenseWithdrawalList(response.data); 
            
        } catch (error) {
            console.error("Error fetching expense withdrawal strategy details:", error);
        }
    }
};

  const fetchRMDStrategy = async () => {
    if (scenario.RMDStrategy.length > 0) {
        try {
        
            const response = await axios.post('http://localhost:8000/getInvestmentList', {
              investmentIds: scenario.RMDStrategy
            });

            setRMDList(response.data); 
            console.log(response.data)
            
        } catch (error) {
            console.error("Error fetching RMD strategy details:", error);
        }
    }
  };
    

    fetchInvestmentType();
    fetchInvestments();
    fetchEvents();
    fetchSpendingStrategy();
    fetchExpenseWithdrawalStrategy();
    fetchRMDStrategy();
  

}, []); 

  return (
    <>
      <div>
      <h1>{scenario.name}</h1>
      </div>

      <div>
        Martial Status: {scenario.maritalStatus}
      </div>

      <br></br>

      <div>
          User Birth Year: {scenario.birthYears[0]}
          <div>
          User Life Expectancy Distribution: {scenario.lifeExpectancy[0].type}
          </div>
          {scenario.lifeExpectancy[0].type === "fixed" &&
          <div>
            Fixed Amount: {scenario.lifeExpectancy[0].value}
          </div>
          }
          {scenario.lifeExpectancy[0].type === "normalDistribution" &&
          <div>
            Mean: {scenario.lifeExpectancy[0].mean}
            Standard Deviation: {scenario.lifeExpectancy[0].stdev}
          </div>
          }
      </div>
      <br></br>
      {scenario.maritalStatus === "couple" &&
        <div>
          <div>
          Spouse Birth Year: {scenario.birthYears[1]}
          <div>
          Spouse Life Expectancy Distribution: {scenario.lifeExpectancy[1].type}
          </div>

          {scenario.lifeExpectancy[1].type === "fixed" &&
          <div>
            Fixed Amount: {scenario.lifeExpectancy[1].value}
          </div>
          }

          {scenario.lifeExpectancy[1].type === "normalDistribution" &&
          <div>
            Mean: {scenario.lifeExpectancy[1].mean}
            Standard Deviation: {scenario.lifeExpectancy[1].stdev}
          </div>
          }

      </div>
        </div>
      }

      <br></br>

      {(investmentTypes !== undefined && investmentTypes.length > 0) &&
      <div>
        <h2>Investment Types:</h2> {investmentTypes.map((investmentType) => {
          return (
          <div>
            Name: {investmentType.name}
            <br></br>
            Description: {investmentType.description}
            <br></br>
            Annual Return Amount or Percent: {investmentType.returnAmtOrPct}
            <br></br>
            Return Distribution: {investmentType.returnDistribution.type}

            {investmentType.returnDistribution.type === "fixed" ? 
            <div>
            Value : {investmentType.returnDistribution.value}
            </div>
            :
            <div>
            Mean : {investmentType.returnDistribution.mean}  
            Standard Deviation: {investmentType.returnDistribution.stdev}  
            </div>
            }

            Expense Ratio: {investmentType.expenseRatio}
            <br></br>
            Income Amount or Percent: {investmentType.incomeAmtOrPct}
            <br></br>

            Income Distribution:{investmentType.incomeDistribution.type }

            {investmentType.incomeDistribution.type === "fixed" ? 
            <div>
            Value : {investmentType.incomeDistribution.value}
            </div>
            :
            <div>
            Mean : {investmentType.incomeDistribution.mean}  
            Standard Deviation: {investmentType.incomeDistribution.stdev}  
            </div>
            }
            Taxability: {investmentType.taxability ? "Taxable" : "Tax-Exempt"}
            <br></br>
            <br></br>
          </div>
          );
        })}
      </div>
      }

    <br></br>
    {(investments !== undefined && investments.length > 0) &&
          <div>
            <h2>Investments: </h2>{investments.map((investment) => {
              return (
              <div>
                Name: {investment.id}
                <br></br>
                Tax Status: {investment.taxStatus}
                <br></br>
                Value: {investment.value}
                <br></br>
                <br></br>
              </div>
              );
            })}
          </div>
      }

    <br></br> 
      {(events !== undefined && events.length > 0) &&
                <div>
                  <h2>Events</h2> {events.map((event) => {
                    return (
                    <div>
                      Name: {event.name}
                      <br></br>
                      Description: {event.description}
                      <br></br>

                      Start Year Distribution: {event.start.type}
                      
                      {/* Start Year Conditional Rendering */}
                      {event.start.type === "fixed" &&
                      <div>
                        Start Year: {event.start.value}
                      </div>
                      }
                      {event.start.type === "normal" &&
                      <div>
                        Mean: {event.start.mean} 
                        Standard Deviation: {event.start.stdev}
                      </div>
                      }
                      {event.start.type === "uniform" &&
                      <div> 
                        Upper Bound: {event.start.upper}
                        Lower Bound: {event.start.lower} 
                      </div>
                      }

                      {(event.start.type === "startWith" || event.start.type === "endWith") &&
                      <div>
                        Event Series: {event.start.eventSeries}
                      </div>
                      }

                      Duration: {event.duration.type}

                      {event.duration.type === "fixed" &&
                      <div>
                        Value: {event.duration.value}
                      </div>
                      }

                      {event.duration.type === "normal" &&
                      <div>
                        Mean: {event.duration.mean}
                        Standard Deviation: {event.duration.stdev}
                      </div>
                      }
                      {event.duration.type === "uniform" &&
                      <div>
                        Upper Bound: {event.duration.upper}
                        Lower Bound: {event.duration.lower}
                      </div>
                      }

                      Type: {event.type}
                      
                      {/* Event Type Cases */}
                      {(event.type === "income" || event.type === "expense") && 
                      <div>
                         Initial Amount: {event.initialAmount}
                         <br></br>

                         Annual Change Amount Or Percent: {event.changeAmtOrPct}
                        <br></br>

                         Inflation Adjusted: {event.inflationAdjusted ? "On" : "Off"}
                        <br></br>

                         Amount Associated With User : {event.userFraction}
                      </div>
                      }

                      {(event.type === "income") && 
                      <div>
                        Social Security: {event.socialSecurity ? "True" : "False"}
                      </div>
                      }

                      {(event.type === "expense") &&  
                      <div> 
                        Discretionary: {event.discretionary ? "True" : "False"}
                      </div>
                      }



                      {(event.type === "invest" || event.type === "rebalance") &&  
                      <div> 
                        <h2>Asset Allocation</h2>
                        <ul>
                          {Object.entries(event.assetAllocation).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          ))}
                        </ul>

                        {(event.type === "invest" && event.glidePath) && 
                          <div>
                            <h2>Asset Allocation 2</h2>
                            <ul>
                              {Object.entries(event.assetAllocation2).map(([key, value]) => (
                                <li key={key}>
                                  <strong>{key}:</strong> {value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        }

                      </div>
                      }

                      {event.type === "invest" && 
                          <div>
                          Glide Path: {event.glidePath ? "On" : "Off"}
                          Max Cash: {event.maxCash}
                          </div>
                        }
                      <br></br>
                    </div>
                    );
                  })}
                </div>
        }
    <br></br>
      <div>
        Inflation Assumption Distribution: {scenario.inflationAssumption.type}

        {scenario.inflationAssumption.type === "fixed" &&
          <div>
            Value: {scenario.inflationAssumption.value}
          </div>
        }
        {scenario.inflationAssumption.type === "normalDistribution" &&
          <div>
            Mean: {scenario.inflationAssumption.mean}
            Standard Deviation: {scenario.inflationAssumption.stdev}
          </div>
        }
        {scenario.inflationAssumption.type === "uniformDistribution" &&
          <div>
            Upper Bound: {scenario.inflationAssumption.upper}
            Lower Bound: {scenario.inflationAssumption.lower}
          </div>
        }
      </div>

      <div>
        Annual After Tax Contribution Limit: {scenario.afterTaxContributionLimit}
      </div>

      <br></br>

      {(spendingStrategyList !== undefined && spendingStrategyList.length > 0) && 
        <div>
        <h2>Spending Strategy</h2> {spendingStrategyList.map((event, i) => (
            <div>
              Rank {i + 1} : {event.name}
            </div>
        ))}
       </div>
      }

      {(spendingStrategyList === undefined || spendingStrategyList.length === 0) && 
          <div>
            <h2>Spending Strategy</h2> 
            <p>None listed</p>
          </div>
        }

      <br></br>
      {(expenseWithdrawalList !== undefined && expenseWithdrawalList.length > 0) && 
        <div>
        <h2>Expense Withdrawal Strategy:</h2> {expenseWithdrawalList.map((investment, i) => (
            <div>
              Rank {i + 1} : {investment.id}
            </div>
        ))}
       </div>
      }

    {(expenseWithdrawalList === undefined || expenseWithdrawalList.length === 0) && 
        <div>
        <h2>Expense Strategy</h2>
        <p>None listed</p>

       </div>
      }

      <br></br>

      {(RMDList !== undefined && RMDList.length > 0) && 
        <div>
        <h2>RMD Strategy:</h2> {RMDList.map((investment, i) => (
            <div>
              Rank {i + 1} : {investment.id}
            </div>
        ))}
       </div>
      }

    {(RMDList === undefined || RMDList.length === 0) && 
        <div>
        <h2>RMD Strategy</h2>
        <p>None listed</p>

       </div>
      }
      <br></br>


      <div>
        Roth Conversion Option: {scenario.RothConversionOpt ? "On": "Off"}
      </div>

      <div>
        Sharing Settings: {scenario.sharingSettings}
      </div>

      <div>
        Financial Goal: {scenario.financialGoal}
      </div>

      <div>
        Residence State: {scenario.residenceState}
      </div>

      <button onClick={() => props.setIsViewPage(false)}>Back</button>

    </>
  );
}

export default ViewScenario;