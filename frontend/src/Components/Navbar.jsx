import { Link } from "react-router-dom"
import { useContext } from "react";
import { StoreContext } from "../store/Store";

const Navbar = (props) => {
  const { user } = useContext(StoreContext);
  return (
    <nav className="navbar">
        <div className="logo">
          <span>@</span>
          <Link style={{ textDecoration: "none", color: "black", fontWeight: "bold" }} to="/">Brighthouse</Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/planning">Planning</Link></li>
          <li><Link to="/uploadScenario">Upload Scenario</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>{!user ? <Link to="/login">Login</Link> : <Link to="/logout">Logout</Link>}</li>
        </ul>
    </nav>
  )
}

export default Navbar;