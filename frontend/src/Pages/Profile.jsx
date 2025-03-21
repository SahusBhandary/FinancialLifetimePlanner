import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from '../Components/Navbar.jsx';
import { StoreContext } from "../store/Store.jsx";
import axios from "axios"; 
import "../css/profile.css";

const Profile = () => {
  const { user } = useContext(StoreContext);

  const [scenarios, setScenarios] = useState([]); // state to store fetched scenarios

  // Fetch scenarios when the user changes
  useEffect(() => {
    const fetchScenarios = async () => {
      if (user?.scenarios?.length > 0) {
        try {
          // fetch scenario data for each scenario ID
          const scenarioData = await Promise.all(
            user.scenarios.map(async (scenarioId) => {
              const response = await axios.get(`http://localhost:8000/getScenario/${scenarioId}`);
              return response.data;
            })
          );
          setScenarios(scenarioData); // set the fetched scenarios in state
        } catch (error) {
          console.error("Error fetching scenarios:", error);
        }
      }
    };

    fetchScenarios();
  }, [user]); //when user gets changed, this will be run to refetch scenarios

  const handleExportScenario = async (scenarioId) => {
    try {
      const response = await axios.get(`http://localhost:8000/export-scenario/${scenarioId}`, {
        responseType: 'blob', 
      });

      // create a download link for the YAML file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scenario-${scenarioId}.yaml`); // set the file name
      document.body.appendChild(link);
      link.click(); // trigger download
      link.remove(); 
    } catch (error) {
      console.error('Error exporting scenario:', error);
      alert('Failed to export scenario.');
    }
  };

  if (!user) {
    return (
      <div>     
        <Navbar/>
        <div className="profile-container">
          <h2>You are not logged in. Your current scenarios and uploaded files will not save. Please login to view the user profile page.</h2>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </div>
      
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content">
          {/* Left Column: User Profile */}
          <div className="profile-card">
            <h2>Hi, {user.name}!</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* Right Column: Tax Files */}
          <div className="tax-files">
            <h3>State Tax Rate Files (FAKE DATA)</h3>
            <ul>
              <li>
                <a href="#">STATE_INCOME_TAX_NY_2025.YAML</a>
                <button className="delete-btn">Delete</button>
              </li>
            </ul>
            <div className="file-buttons">
              <button className="download-btn">Download All</button>
              <button className="delete-all-btn">Delete All</button>
            </div>
          </div>
        </div>

        <div className="scenarios">
          <h3>Scenarios</h3>
          {scenarios.length > 0 ? (
            scenarios.map((scenario, index) => (
              <div key={index} className="scenario">
                <p><strong>Name:</strong> {scenario.name}</p>
                <p><strong>Financial Goal:</strong> {scenario.financialGoal}</p>
                <div className="scenario-buttons">
                  <button onClick={() => handleExportScenario(scenario._id)} >Export</button>
                  <button>Share</button>
                  <button>Edit</button>
                  <button>Simulate</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No scenarios found. Create a new scenario to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;