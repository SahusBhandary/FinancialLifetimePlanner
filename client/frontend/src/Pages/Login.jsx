import Navbar from '../Components/Navbar.jsx'

const Login = (props) => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return(
    <>
      <Navbar/> 
      <h1> this is login </h1>
      <button onClick={handleGoogleLogin}>Login With Google</button>   
    </>
  )
}


export default Login;
