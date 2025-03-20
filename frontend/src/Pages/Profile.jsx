import React, { useContext } from "react";
import Navbar from '../Components/Navbar.jsx';
import { StoreContext } from "../store/Store.jsx";
import "../css/profile.css";

const Profile = () => {
  const { user } = useContext(StoreContext);

  // Fake scenario info for demo
  const scenarios = [
    { name: "Retirement Plan", goal: "$1,000,000" },
    { name: "Aggressive Investment", goal: "$1,000,000,000" },
  ];

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content">
          {/* Left Column: User Profile */}
          <div className="profile-card">
            <h2>Hi, {user?.name || "User"}!</h2>
            <p><strong>Name:</strong> {user?.name || "User"}</p>
            <p><strong>Email:</strong> {user?.email || "user@gmail.com"}</p>
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

        {/* Scenarios Section */}
        <div className="scenarios">
          <h3>Scenarios (FAKE DATA) </h3>
          {scenarios.map((scenario, index) => (
            <div key={index} className="scenario">
              <p><strong>Name:</strong> {scenario.name} <strong>Financial Goal:</strong> {scenario.goal}</p>
              <div className="scenario-buttons">
                <button>Share</button>
                <button>Edit</button>
                <button>Simulate</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
