import { Link } from "react-router-dom"

const Navbar = (props) => {
  return (
    <div>
      <div> Brighthouse </div>
      <div> <Link to="/planning">Planning</Link> | Scenarios | Profile | Login </div>
    </div>
  )
}

export default Navbar;