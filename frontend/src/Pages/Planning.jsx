import Navbar from '../Components/Navbar.jsx'
import InvestmentForm from '../Components/InvestmentForm.jsx';
import ScenerioForm from '../Components/ScenarioForm.jsx';
import EventForm from '../Components/EventForm.jsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InitialInvestmentsForm from '../Components/InitialInvestmentsForm.jsx';
import { useState } from 'react';

const Planning = (props) => {

  return(
    <>
    <Navbar/>
    <InitialInvestmentsForm/>
    <InvestmentForm/>
    <EventForm/>
    <ScenerioForm/>
    </>
  )
}



export default Planning;
