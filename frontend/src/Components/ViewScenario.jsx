import axios from 'axios';
import { useState, useEffect} from 'react';

const ViewScenario = (props) => { 
  let scenario = props.scenario;

  const [investments, setListOfInvestments] = useState(); // investments
  const [investmentTypes, setInvestments] = useState(); // investment types
  const [events, setEvents] = useState();
  
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
                for (let i = 0; i < response.data.length; i++) {
                    investments[i] = response.data[i]
                }
                
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
    

    fetchInvestmentType();
    fetchInvestments();
    fetchEvents();
  

}, []); 

console.log(investments);
console.log(investmentTypes);
console.log(events);

  return (
    <>
      <div>
      <h1>{scenario.name}</h1>
      </div>

      <div>
        Martial Status: {scenario.maritalStatus}
      </div>

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

      {console.log(investmentTypes)}

      {(investmentTypes !== undefined && investmentTypes.length > 0) &&
      <div>
        Investment Types: {investmentTypes.map((investmentType) => {
          return (
          <div>
            Name: {investmentType.name}
            Description: {investmentType.description}
            Annual Return Amount or Percent: {investmentType.returnAmtOrPct}
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
            Income Amount or Percent: {investmentType.incomeAmtOrPct}
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
          </div>
          );
        })}
      </div>
      }


    {(investments !== undefined && investments.length > 0) &&
          <div>
            Investments: {investments.map((investment) => {
              return (
              <div>
                Name: {investment.id}
                Tax Status: {investment.taxStatus}
                Value: {investment.value}
                <br></br>
              </div>
              );
            })}
          </div>
      }

      
      {(events !== undefined && events.length > 0) &&
                <div>
                  Events: {events.map((event) => {
                    return (
                    <div>
                      Name: {event.name}
                      Description: {event.description}
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
                         Annual Change Amount Or Percent: {event.changeAmtOrPct}
                         Inflation Adjusted: {event.inflationAdjusted ? "On" : "Off"}
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
                      
                    </div>
                    );
                  })}
                </div>
            }

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

      {/* <div>
        Spending Strategy: {scenario.spendingStrategy}
      </div>

      <div>
        Expense Withdrawal Strategy: {scenario.expenseWithdrawalStrategy}
      </div>

      <div>
        RMD Strategy: {scenario.RMDStrategy}
      </div> */}


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

    </>
  );
}

export default ViewScenario;