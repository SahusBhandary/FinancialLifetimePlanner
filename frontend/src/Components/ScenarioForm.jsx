import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from "../store/Store";

const ScenerioForm = (props) => {
    const { user } = useContext(StoreContext);
    const [name, setName] = useState("");
    const [isMarried, setIsMarried] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [investments, setInvestments] = useState([]); 
    const [events, setEvents] = useState([]); 
    const [inflationAssumption, setInflationAssumption] = useState()
    const [limitOnAnnualContributions, setLimitOnAnnualContributions] = useState()
    const [spendingStrategy, setSpendingStrategy] = useState()
    const [expenseWithdrawlStrategy, setExpenseWithdrawlStategy] = useState()
    const [RMDStrategy, setRMDStrategy] = useState()
    const [rothConvesionStrategy, setRothConversionStrategy] = useState()
    const [rothConvesionOptimizerSettings, setRothConversionOptimizerSettings] = useState()
    const [financialGoal, setFinancialGoal] = useState()
    const [stateOfResidence, setStateOfResidence] = useState()
    const [count, setCount] = useState(0);




    console.log(user)
    useEffect(() => {
        if (!user) {
            return
        }
        const fetchInvestments = async () => {
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

        fetchInvestments();
        fetchEvents();
    }, [user]); 

    return (
        <div>
            <h1>Scenerio</h1>

            <div>
                <span>Name</span>
                <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <span>Married?</span>
                <label><input type="radio" name="married" value="yes" onChange={(e) => setIsMarried(e.target.value)} />Yes</label>
                <label><input type="radio" name="married" value="no" onChange={(e) => setIsMarried(e.target.value)} />No</label>
            </div>

            <div>
                <span>Birth Year</span>
                <input type="text" onChange={(e) => setBirthYear(e.target.value)} />
            </div>


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
                <input type="text" onChange={(e) => setInflationAssumption(e.target.value)} />
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
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value) || 0)}
                />
                <ul>
                    {Array.from({ length: count }, (_, i) => (
                        <div>
                            <h3>{i + 1}</h3>
                            <select>
                                <option>expense 1</option>
                                <option>expense 2</option>
                                <option>expense 3</option>
                                <option>expense 4</option>
                            </select>
                        </div>
                    
                    ))}
                </ul>
            </div>

            <div>
                <span>Expense Withdrawl Stategy</span>
                <input type="text" onChange={(e) => setExpenseWithdrawlStategy(e.target.value)} />
            </div>

            <div>
                <span>RMD Stategy</span>
                <input type="text" onChange={(e) => setRMDStrategy(e.target.value)} />
            </div>

            <div>
                <span>Roth conversion Stategy</span>
                <input type="text" onChange={(e) => setRothConversionStrategy(e.target.value)} />
            </div>

            <div>
                <span>Roth conversion optimizer settings</span>
                <input type="text" onChange={(e) => setRothConversionOptimizerSettings(e.target.value)} />
            </div>

            <div>
                <span>Financial Goal</span>
                <input type="text" onChange={(e) => setFinancialGoal(e.target.value)} />
            </div>

            <div>
                <span>State of residence</span>
                <input type="text" onChange={(e) => setStateOfResidence(e.target.value)} />
            </div>
        </div>
    );
};

export default ScenerioForm;
