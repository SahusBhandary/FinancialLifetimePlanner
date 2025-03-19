import { Link } from "react-router-dom"

const Navbar = (props) => {
  return (
    <nav className="navbar">
        <div className="logo">
          <span>@</span>
          <Link style={{ textDecoration: "none", color: "black", fontWeight: "bold" }} to="/">Brighthouse</Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/planning">Planning</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul> 
    </nav>
  )
}

export default Navbar;