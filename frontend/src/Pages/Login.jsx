import Navbar from '../Components/Navbar.jsx'
import axios from 'axios';
import GoogleIcon from '@mui/icons-material/Google';
axios.defaults.withCredentials = true;


const Login = () => {
  const handleGoogleLogin = async () => {
    window.location.href = 'http://localhost:8000/auth/google'
  };

  return(
    <>
      <Navbar/> 
      <div style={ {display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: "40px"} }>
        <div className='login-text' style={{display: 'flex', justifyContent: 'center'}}>Welcome to Financial Life Planner!</div>
        <div style={{display: 'flex', justifyContent: 'center'}}><button className='login-button' onClick={handleGoogleLogin} style={{width: 'auto'}}><div style={{display: "flex", justifyContent: 'center'}}><GoogleIcon></GoogleIcon><div style={{paddingTop: "4px", paddingLeft:"8px"}}>Continue With Google</div></div></button></div>
        
      </div>
    </>
  )
}


export default Login;
