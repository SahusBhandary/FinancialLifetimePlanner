import Navbar from '../Components/Navbar.jsx'
import InvestmentForm from '../Components/InvestmentForm.jsx';
import ScenerioForm from '../Components/ScenarioForm.jsx';
import EventForm from '../Components/EventForm.jsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InitialInvestmentsForm from '../Components/InitialInvestmentsForm.jsx';
import { useState } from 'react';

const Planning = (props) => {
  const [form, setForm] = useState(0);
  const handleRightArrowClick = () => {
    setForm(form + 1)
  }
  const handleLeftArrowClick = () => {
    setForm(form - 1)
  }
  
  return(
    <>
    <Navbar/>
    
    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
      <div style={{display: 'flex', alignItems: 'center', marginLeft: '30px'}}><ArrowBackIosNewIcon onClick={handleLeftArrowClick} sx={{cursor: 'pointer'}}/></div>
      {Math.abs(form) % 4 === 0 ? <InitialInvestmentsForm/> : ""}
      {Math.abs(form) % 4 === 1 ? <InvestmentForm/> : ""}
      {Math.abs(form) % 4 === 2 ? <EventForm/> : ""}
      {Math.abs(form) % 4 === 3 ? <ScenerioForm/> : ""}
      <div style={{display: 'flex', alignItems: 'center', marginRight: '30px'}}><ArrowForwardIosIcon onClick={handleRightArrowClick} sx={{cursor: 'pointer'}}/></div>
    </div>
    </>
  )
}



export default Planning;
