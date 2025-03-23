import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../store/Store'; 
import Navbar from '../Components/Navbar';

const UploadScenario = () => {
  const { user } = useContext(StoreContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to import a scenario.');
      return;
    }

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('scenarioFile', file);
    formData.append('userId', user._id); 

    try {
      const response = await axios.post('http://localhost:8000/import-scenario', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Scenario imported successfully!');
        console.log('Scenario:', response.data.scenario);
      }
    } catch (error) {
      console.error('Error importing scenario:', error);
      alert('Failed to import scenario.');
    }
  };

  return (
    
    <div>
        <Navbar />
        <div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <h1>Import Scenario</h1>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <form onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="file">Upload YAML File:</label>
                      <input type="file" id="file" accept=".yaml" onChange={handleFileChange} required />
                  </div>
                  <button type="submit">Import Scenario</button>
              </form>
            </div>
              
          </div>
        </div>
        
        
    </div>
  );
};

export default UploadScenario;