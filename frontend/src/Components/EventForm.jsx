import { useState } from 'react'; 
import NormalDistributionForm from './NormalDistributionForm.jsx';
import UniformDistributionForm from './UniformDistributionForm.jsx';
import AssetAllocationForm from "./AssetAllocationForm.jsx"
import { useContext } from "react";
import { StoreContext } from "../store/Store";

const EventForm = (props) => {
    const { user } = useContext(StoreContext)
    const [startYearOption, setStartYearOption]  = useState("");
    const [durationOption, setDurationOption]  = useState("");
    const [eventType, setEventType] = useState("");
    const [eventAnnualIncomeOption, setEventAnnualIncomeOption] = useState("");
    const [assetAllocationType ,setAssetAllocationType] = useState("");


    return (
       <>
       {/* Events Section */}
        <div>
        <h1>Events</h1>
        
        {/* Name Form */}
        <div>
            <span>Name</span>
            <input type="text"></input>
        </div>
        
        {/* Description Form */}
        <div>
            <span>Description</span>
            <input type="text"></input>
        </div>
        
        {/* Start Year Form */}
        <div>
            <span> Start Year </span>
            <select onChange={(e) => setStartYearOption(e.target.value)}>
            <option value="">Select an option</option>
            <option value="fixed">Fixed</option>
            <option value="normalDistribution">Normal Distribution</option>
            <option value="uniformDistribution">Uniform Distribution</option>
            <option value="startYearEvent"> Start Year of Specified Event Series </option>
            <option value="endYearEvent"> End Year of Specified Event Series </option>
            </select>

            {/* Start Year Different Options */}
            {startYearOption === "fixed" && 
            <div>
            <span>Enter Start Year</span>
            <input type="text"></input>
            </div>
            }

            {startYearOption === "normalDistribution" && 
            <NormalDistributionForm/>
            }

            {startYearOption === "uniformDistribution" && 
            <UniformDistributionForm/>
            }

            {startYearOption === "startYearEvent" && 
            <div>
            <div>
                <span>Name of Event</span>
                <input type="text"></input>
            </div>
            </div>
            }

            {startYearOption === "endYearEvent" && 
            <div>
            <div>
                <span>Name of Event</span>
                <input type="text"></input>
            </div>
            </div>
            }

        </div>


        {/* Duration Form */}
        <div>
            <span>Duration</span>
            <select onChange={(e) => setDurationOption(e.target.value)}>
            <option value="">Select an option</option>
            <option value="fixed">Fixed</option>
            <option value="normalDistribution">Normal Distribution</option>
            <option value="uniformDistribution">Uniform Distribution</option>
            </select>

            {/* Duration Different Options */}
            {durationOption === "fixed" &&
            <div>
            <span>Enter Duration</span>
            <input type="text"></input>
            </div>
            }

            {durationOption === "normalDistribution" &&
            <NormalDistributionForm/>
            }

            {durationOption === "uniformDistribution" &&
            <UniformDistributionForm/>
            }
        </div>

        <div>
            <span>Event Type</span>
            <select onChange={(e) => setEventType(e.target.value)}>
            <option value="">Select an option</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="invest">Invest</option>
            <option value="rebalance">Rebalance</option>
            </select>

            { (eventType === "income" || eventType ==="expense") &&
            <div>
                <div>
                <span>Initial Amount</span>
                <input type="text"></input>
                </div>
                <div>
                <span>Expected Annual Change</span>
                <select onChange={(e) => setEventAnnualIncomeOption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="percent">Percent Change</option>
                    <option value="normalDistribution">Normal Distribution</option>
                    <option value="uniformDistribution">Uniform Distribution</option>
                </select>

                {eventAnnualIncomeOption === "fixed" &&
                <div>
                    <span>Enter Fixed Amount</span>
                    <input type="text"></input>
                </div>
                }
                {eventAnnualIncomeOption === "percent" &&
                <div>
                    <span>Enter Percent Change</span>
                    <input type="text"></input>
                </div>
                }
                {eventAnnualIncomeOption === "normalDistribution" &&
                <NormalDistributionForm/>
                }
                {eventAnnualIncomeOption === "uniformDistribution" &&
                <UniformDistributionForm/>
                }
                </div>

                <div>
                <span>Inflation Adjusted</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="inflationFlag" value="inflationTrue"></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="inflationFlag" value="inflationFalse"></input>
                    No
                    </label>
                </form>
                </div>

                <div>
                <span>Percent Associated With User</span>
                <input type="text"></input>
                </div>
                
                {eventType === "income" &&
                <div>
                <span>Is this income Social Security?</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="socialSecurityFlag" value="socialSecurityTrue"></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="socialSecurityFlag" value="socialSecurityFalse"></input>
                    No
                    </label>
                </form>
                </div>
                }

                {eventType === "expense" &&
                <div>
                <span>Is the expense discretionary?</span>
                <form style={{ display: "inline-block"}}>
                    <label>
                    <input type="radio" name="discretionaryFlag" value="discretionaryFalse"></input>
                    Yes
                    </label>
                    <label>
                    <input type="radio" name="discretionaryFlag" value="discretionaryTrue"></input>
                    No
                    </label>
                </form>
                </div>
                }
            </div>
            }

            { eventType === "invest" &&
            <div>
                <div>
                    <span>Enter type of asset allocation</span>
                    <select onChange={(e) => setAssetAllocationType(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="fixed">Fixed</option>
                    <option value="glidePath">Glide Path</option>
                    </select>

                    {(assetAllocationType === "fixed" || assetAllocationType === "glidePath") &&
                    <div>
                    <AssetAllocationForm assetAllocationType={assetAllocationType} investmentCount={user.investmentTypes.length}/>     
                    </div>
                    }
                </div>
                <div>
                <span>Max Cash</span>
                <input type="text"></input>
                </div>
            </div>
            }

            { eventType === "rebalance" &&
            <div>
                <AssetAllocationForm assetAllocationType={"rebalance"}/>
            </div>
            }


        </div>

        </div>
       
       </>



    
    )
}

export default EventForm;