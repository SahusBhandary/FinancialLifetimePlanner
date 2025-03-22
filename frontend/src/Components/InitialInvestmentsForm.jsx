import { useState, useEffect } from 'react'; 
import { useContext } from "react";
import { StoreContext } from "../store/Store";
import axios from 'axios'

const InitialInvestmentsForm = (props) => {

    const { user } = useContext(StoreContext)
    const [investments, setInvestments] = useState([]);
    const [taxStatus, setTaxStatus] = useState();
    const [initialValue, setInitialValue] = useState();
    const [investmentType, setInvestmentType] = useState();


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
        fetchInvestments();
    }, [user]); 

    const handleSubmit = async () => {
        try {
            
            const response = await axios.post("http://localhost:8000/submitInvestment", {
                investmentTypeName: investmentType,
                taxStatus: taxStatus,
                initialValue: initialValue,
                user: user
            });
            window.location.reload()
            
        } catch (error) {
            console.error("Error submitting investment:", error);
        }
    };

    return (
        <div>
            <h1>Investment</h1>
            <span>Investment Type</span>
            <select onChange={(e) => setInvestmentType(e.target.value)}>
            <option>Please select an option:</option>
            {investments.map((investment, index) => (
                <option>{investment.name}</option>
            ))}
            </select>
            <br></br>
            <span>Initial Value</span>
            <input type="text" onChange={(e) => setInitialValue(e.target.value)}></input>
            <br></br>
            <span>Tax Status</span>
            <label><input type="radio" value="non-retirement" onChange={(e) => setTaxStatus(e.target.value)}/>Non-retirement</label>
            <label><input type="radio" value="pre-tax" onChange={(e) => setTaxStatus(e.target.value)}/>Pre-tax</label>
            <label><input type="radio" value="after-tax" onChange={(e) => setTaxStatus(e.target.value)}/>After tax</label>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )

}

export default InitialInvestmentsForm