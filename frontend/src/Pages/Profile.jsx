import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from '../Components/Navbar.jsx';
import { StoreContext } from "../store/Store.jsx";
import axios from "axios"; 
import "../css/profile.css";
import EditScenario from "../Components/EditScenario.jsx";
import EditSharedScenario from "../Components/EditSharedScenario.jsx";
import ViewScenario from "../Components/ViewScenario.jsx"

const Profile = () => {
  const { user, refreshUser } = useContext(StoreContext);

  const [isEditPage, setIsEditPage] = useState(false);
  const [isViewPage, setIsViewPage] = useState(false);
  const [isSharedEditPage, setIsSharedEditPage] = useState(false);

  const [selectedScenario, setSelectedScenario] = useState(null);

  const [tempUser, setTempUser] = useState();

  const findTempUser = async (scenario) => {
    const response = await axios.post('http://localhost:8000/getUserWithScenario', {
      scenario: scenario
    });
    return response.data.user
  }

  //refresh user data
  useEffect(() => async() => {
    refreshUser()
  }, [])

  const [scenarios, setScenarios] = useState([]); // state to store fetched scenarios
  const [sharedScenarios, setSharedScenarios] = useState([]); // state to store fetched scenarios

  const [files, setFiles] = useState([]); // state to store the fetched state tax files

  // fetch scenarios when the user changes
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

    const fetchSharedScenarios = async () => {
      if (user?.sharedScenarios?.length > 0) {
        try {
          // fetch scenario data for each scenario ID
          const scenarioData = await Promise.all(
            user.sharedScenarios.map(async (scenarioId) => {
              const response = await axios.get(`http://localhost:8000/getScenario/${scenarioId}`);
              return response.data;
            })
          );
          setSharedScenarios(scenarioData); // set the fetched scenarios in state
        } catch (error) {
          console.error("Error fetching shared scenarios:", error);
        }
      }
    };

    fetchScenarios();
    fetchSharedScenarios();
  }, [user]); //when user gets changed, this will be run to refetch scenarios

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (user?.uploadedFiles?.length > 0) {
          const response = await axios.get(`http://localhost:8000/user/files?userId=${user._id}`);
          
          setFiles(response.data.files);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        alert('Failed to fetch files');
      }
    };
  
    fetchFiles();
  }, [user]);


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

  const handleDelete = async (fileId) => {
    try {
      const userId = user._id; 
      const response = await axios.delete('http://localhost:8000/user/deleteFile', {
        params: { userId, fileId }, 
      });
  
      if (response.data.success) {
        alert('File and associated data deleted successfully.');
        
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
      } else {
        throw new Error(response.data.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again later.');
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const userId = user._id; 
      const response = await axios.get('http://localhost:8000/user/downloadFile', {
        params: { userId, fileId },
        responseType: 'blob', 
      });
  
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'state_tax_data.yaml';
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // set file name
      document.body.appendChild(link);
      link.click(); // trigger the download
      link.remove(); // clean up the link 
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again later.');
    }
  };
  
  const handleShareScenario = async (scenario) => {
    try {
      const email = prompt("Enter the email to share this scenario:");
      
      if (email) {
        const response = await axios.post('http://localhost:8000/shareScenario', {
          email: email,
          scenario: scenario
         });

        alert(`Scenario '${scenario.name}' shared with ${email}`);
  
      } else {
        alert('No email entered. Sharing cancelled.');
      }
    } catch (error) {
      console.error('Error sharing scenario:', error);
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

  if (isViewPage === true && isEditPage === false && isSharedEditPage === false){
    return (
      <>
      <Navbar/>
      <ViewScenario scenario={selectedScenario} setIsViewPage={setIsViewPage}/>
      </>
    )
  }

  if (isEditPage === true && isSharedEditPage === false){
   return (
    <>
    <Navbar/>
    <EditScenario scenario={selectedScenario} tempUser={tempUser} setIsEditPage={setIsEditPage}/>
    </>
   );
  }
  if (isSharedEditPage === true) {
      return (
       <>
       <Navbar/>
       <EditSharedScenario scenario={selectedScenario} tempUser={tempUser} setIsEditPage={setIsEditPage} setIsSharedEditPage={setIsSharedEditPage}/>
       </>
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
            <h3>State Tax Rate Files</h3>
            <ul>
              {files.map((file) => (
                <li key={file._id}>
                  <a href="#" onClick={() => handleDownload(file._id)}>
                    {file.fileName || `File_${file._id}`}
                  </a>
                  <button className="delete-btn" onClick={() => handleDelete(file._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
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
                  <button onClick={() => handleShareScenario(scenario)}>Share</button>
                  <button onClick={async () => {
                  setIsEditPage(false);
                  setIsViewPage(true);
                  setIsSharedEditPage(false);
                  setSelectedScenario(scenario);
                }}>View</button>
                  <button onClick={() => {
                    setIsEditPage(true)
                    setIsViewPage(false);
                    setSelectedScenario(scenario);
                    }}>Edit</button>
                  <button>Simulate</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No scenarios found. Create a new scenario to get started.</p>
          )}
        </div>

        <div className="scenarios">
          <h3>Shared Scenarios</h3>
          {sharedScenarios.length > 0 ? (
            sharedScenarios.map((scenario, index) => (
              <div key={index} className="scenario">
                <p><strong>Name:</strong> {scenario.name}</p>
                <p><strong>Financial Goal:</strong> {scenario.financialGoal}</p>
                <button onClick={async () => {
                  setIsEditPage(false);
                  setIsViewPage(true);
                  setIsSharedEditPage(false);
                  setSelectedScenario(scenario);
                }}>View</button>
                {scenario.sharingSettings === 'read-write' && 
                <button onClick={async () => {
                  setIsEditPage(true)
                  setIsViewPage(false);
                  setIsSharedEditPage(true)
                  setSelectedScenario(scenario);
                  const tempUserData = await findTempUser(scenario);
                  setTempUser(tempUserData);
                  }}>Edit</button>
                }
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