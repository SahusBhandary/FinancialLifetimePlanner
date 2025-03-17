import { Link } from "react-router-dom"


const Home = (props) => {
  return(
    <>
    <h1>This is Home</h1>
    <Link to="/">Brighthouse</Link>
    <Link to="/planning">Planning</Link>
    <Link to="/profile">Profile</Link>
    <Link to="/login">Login</Link>
    </>
  )
}


export default Home;
