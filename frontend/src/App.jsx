import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Planning from "./Pages/Planning"
import Profile from "./Pages/Profile"
import Simulation from "./Pages/Simulation"
import Logout from "./Pages/Logout"
import UploadScenario from './Pages/UploadScenario';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/uploadScenario" element={<UploadScenario/>}/>
        <Route path="/planning" element={<Planning/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/simulation" element={<Simulation/>}/>
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </Router>
  );
}

export default App;
