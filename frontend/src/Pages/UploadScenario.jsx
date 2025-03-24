import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../store/Store'; 
import Navbar from '../Components/Navbar';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Button, Typography, Link } from '@mui/material';

const UploadScenario = () => {
  const { user } = useContext(StoreContext);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle dropping the file onto the drop zone
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFile(file);
    }
  };

  // Necessary to allow dropping
  const handleDragOver = (event) => {
    event.preventDefault();
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

  const handleClick = () => {
    fileInputRef.current.click(); 
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
            <Box
              sx={{
                border: '2px dashed gray',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
              <div>
                <UploadIcon  sx={{color:'black', fontSize: 80}}></UploadIcon>
              </div>
              <div style={{display: 'flex', justifyContent:'center'}}>
                <Link component="button" variant="body2" onClick={handleClick} style={{ marginRight: '4px' }}>
                  Choose a File
                </Link>
                <div>
                  or Drag it here
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                />
              </div>
              {file && (
                <Typography className="form-text" variant="body1" sx={{ marginTop: '1rem' }}>
                  {file.name}
                </Typography>
              )}
                <div style={{display: 'flex', marginLeft: '30px', marginRight: '50px', justifyContent: 'center', paddingTop: '10px'}}>
                    <button variant="contained" className='create-button-form' style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '50px', paddingRight: '50px'}}onClick={handleSubmit}>Upload YAML File</button>
                </div>
              </Box>
              
            </div>
              
              
          </div>
        </div>
        
        
    </div>
  );
  // const [selectedFile, setSelectedFile] = useState(null);

  // // Handle file selection via the file chooser
  // const handleFileSelect = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  // // Handle dropping the file onto the drop zone
  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  // // Necessary to allow dropping
  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  // return (
  //   <Box
  //     sx={{
  //       border: '2px dashed gray',
  //       borderRadius: '8px',
  //       padding: '20px',
  //       textAlign: 'center',
  //       cursor: 'pointer',
  //     }}
  //     onDrop={handleDrop}
  //     onDragOver={handleDragOver}
  //   >
  //     <Typography variant="h6" gutterBottom>
  //       Drag & drop a file here, or click below to choose
  //     </Typography>
      
  
      
      
  //   </Box>
  // );
};

export default UploadScenario;