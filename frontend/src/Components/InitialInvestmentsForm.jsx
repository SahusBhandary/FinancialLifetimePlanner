import { useState, useEffect } from 'react'; 
import { useContext } from "react";
import { StoreContext } from "../store/Store";
import axios from 'axios'
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl, InputLabel, RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material';

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
        <div style={{width: '100%', marginLeft: '75px', marginRight: '75px',}}>
            <div className="form-div" style={{display: 'flex', alignContent: 'center', flexDirection: 'column',  marginTop: '30px'}}>
            <div>
                <h1 className='form-title'>Investment Type</h1>
            </div>
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Investment Type</div>
                <FormControl fullWidth size="small" sx={{flex: 1}}>
                    <InputLabel>Select an Option</InputLabel>
                    <Select 
                    onChange={(e) => setInvestmentType(e.target.value)}
                    value={investmentType}
                    label="Select Option"
                    >
                    {investments.map((investment, index) => (
                        <MenuItem key={index} value={investment.name}>{investment.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
            
            <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px'}}>
                <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Initial Value</div>
                <TextField 
                label="Initial Value"
                onChange={(e) => setInitialValue(e.target.value)}
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
            <div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', marginBottom: '20px', flexDirection: 'row'}}>
                    <div className='form-text' style={{display: 'flex', alignItems: 'center', flex: 1}}>Tax Status</div>
                    <FormControl>
                        <RadioGroup
                            row
                            name="taxStatus"
                            value={taxStatus}
                            onChange={(e) => setTaxStatus(e.target.value)}
                        >
                            <FormControlLabel value="non-retirement" control={<Radio />} label="Non-Retirement"/>
                            <FormControlLabel value="pre-tax" control={<Radio />} label="Pre-Tax"/>
                            <FormControlLabel value="after-tax" control={<Radio />} label="After-Tax"/>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center'}}>
                    <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={handleSubmit}>Create</button>
                </div>
        </div>
    </div>
    </div>
            
    )

}

export default InitialInvestmentsForm