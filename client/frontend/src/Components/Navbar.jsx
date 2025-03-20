import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
const Navbar = (props) => {
  const [user, setUser] = useState("")
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const tokenResponse = await axios.get('http://localhost:8000/auth/getUserCookie', {
          withCredentials: true,
        });
        console.log(tokenResponse);
        

        if (tokenResponse?.data){
          const user = jwtDecode(tokenResponse.data);
          if (user != ""){
            setUser(user);
          }
        }
      }
      catch(error){
        console.error("Error Fetching User's ID: ", error);
      }
    }
    fetchUser();
  }, [])
  console.log(user);
  return (
    <nav className="navbar">
        <div className="logo">
          <span>@</span>
          <Link style={{ textDecoration: "none", color: "black", fontWeight: "bold" }} to="/">Brighthouse</Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/planning">Planning</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>{!user ? <Link to="/login">Login</Link> : <Link to="/logout">Logout</Link>}</li>
        </ul>
    </nav>
  )
}

export default Navbar;