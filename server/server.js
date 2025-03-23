require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./passport');
const cookieParser = require('cookie-parser')
const InvestmentTypeModel = require('./models/InvestmentType')
const ScenarioModel = require('./models/Scenario')
const StateTax = require('./models/StateTax');
const File = require('./models/StateTaxFile');
const TaxBracket = require('./models/TaxBracket')
const EventSeriesModel = require('./models/EventSeries')
const InvestmentModel = require('./models/Investment')
const UserModel = require('./models/User')


//stuff for importing/exporting
const fs = require('fs');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  });
const importScenarioFromYAML = require('./importScenario');
const exportScenarioToYAML= require('./exportScenario'); 
const importStateTaxBracketsFromYaml = require('./importStateTax');
const exportStateTaxBracketsToYaml = require('./exportStateTax');


mongoose.connect('mongodb://127.0.0.1:27017/flp');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.post("/submitEvent", async (req, res) => {
    try {
        const { user, event } = req.body;

        const eventObj = new EventSeriesModel(event);
        await eventObj.save();
        const userObj = await UserModel.findOne({
            googleID: user.googleID
        })
        userObj.events.push(eventObj._id);
        userObj.save();

        res.status(200).send({message: "Event submitted successfully!"});

    } catch (error) {
        console.error("Error submitting event.", error);
        res.status(500).send({ message: "Error submitting event." });
    }
})

app.post("/submitInvestment", async (req, res) => {
    try {
        const { investmentTypeName, taxStatus, initialValue, user } = req.body;

        const existingUser = await UserModel.findOne({ googleID: user.googleID })

        const investmentTypeObj = await InvestmentTypeModel.findOne({name: investmentTypeName})

        let id = investmentTypeName + ' ' + taxStatus;
        const inv = {
            investmentType: investmentTypeObj,
            value: initialValue,
            taxStatus: taxStatus,
            id: id
        }

        
        let newInvestment = new InvestmentModel(inv)
        await newInvestment.save()

        existingUser.investments.push(newInvestment._id);
        existingUser.save()
        
        res.send({message: "Investment successfully added to database."})

    } catch (error) {
        console.error("Error adding investment.", error);
        res.status(500).send({ message: "Error adding investment." });
    }
});

app.post("/getInvestmentList", async (req, res) => {
    try {
        const { investmentIds } = req.body;

        const investments = await InvestmentModel.find({
            _id: { $in: investmentIds }
        });

        res.status(200).send(investments);

    } catch (error) {
        console.error("Error retrieving investments.", error);
        res.status(500).send({ message: "Error retrieving investments." });
    }
});

app.post("/submitInvestmentType", async (req, res) => {
  try {
      const { form, user } = req.body;

      const existingUser = await UserModel.findOne({ googleID: user.googleID }).populate('investmentTypes');

      const hasInvestmentType = existingUser.investmentTypes.some(type => type.name === form.name);

      if (hasInvestmentType) {
          return res.status(400).send({ message: "Investment type already exists for this user." });
      }

      let existingType = await InvestmentTypeModel.findOne({ name: form.name });

      if (!existingType) {
          existingType = new InvestmentTypeModel(form);
          await existingType.save();
      }

      existingUser.investmentTypes.push(existingType._id);
      await existingUser.save();

      res.send({ message: "Investment type successfully added to user." });

  } catch (error) {
      console.error("Error submitting investment type.", error);
      res.status(500).send({ message: "Error submitting investment type" });
  }
});



app.post("/getInvestments", async (req, res) => {
    try {
        const { investmentIds } = req.body;

        const investments = await InvestmentTypeModel.find({
            _id: { $in: investmentIds }
        });

        res.status(200).send(investments);

    } catch (error) {
        console.error("Error retrieving investments.", error);
        res.status(500).send({ message: "Error retrieving investments." });
    }
});

app.post("/getEvents", async (req, res) => {
    try {
        const { eventIds } = req.body;

        const events = await EventSeriesModel.find({
            _id: { $in: eventIds }
        });

        res.status(200).send(events);

    } catch (error) {
        console.error("Error retrieving events.", error);
        res.status(500).send({ message: "Error retrieving events." });
    }
});

app.post("/submitScenario", async (req, res) => {
  try {
      const { scenario, user } = req.body;

      const scenarioObj = new ScenarioModel(scenario);
      await scenarioObj.save();
      const userObj = await UserModel.findOne({
          googleID: user.googleID
      })

      userObj.scenarios.push(scenarioObj._id);
      userObj.save();

      res.status(200).send({message: "Scenario submitted successfully!"});

  } catch (error) {
      console.error("Error submitting scenario.", error);
      res.status(500).send({ message: "Error submitting scenario." });
  }
})



app.post('/import-scenario', upload.single('scenarioFile'), async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Validate the user ID
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Access the file content from the buffer
      const fileContent = req.file.buffer.toString('utf8');
  
      // Import scenario from the YAML
      const scenario = await importScenarioFromYAML(fileContent, userId);
  
      res.status(201).json({ message: 'Scenario imported successfully', scenario });
    } catch (error) {
      console.error('Error importing scenario:', error);
      res.status(500).json({ error: 'Failed to import scenario', details: error.message });
    }
  });


  // gets the scenarios 
  app.get('/getScenario/:scenarioId', async (req, res) => {
    try {
      const scenario = await ScenarioModel.findById(req.params.scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }
      res.status(200).json(scenario);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      res.status(500).json({ error: 'Failed to fetch scenario' });
    }
  });

  // used for exporting scenario into yaml file (on user profile)
  app.get('/export-scenario/:scenarioId', async (req, res) => {
    try {
      const { scenarioId } = req.params;
  
      // export the scenario to YAML
      const yamlString = await exportScenarioToYAML(scenarioId);
  
      // set headers for file download
      res.setHeader('Content-Type', 'application/yaml');
      res.setHeader('Content-Disposition', `attachment; filename="scenario-${scenarioId}.yaml"`);
  
      // send the YAML string as the response
      res.send(yamlString);
    } catch (error) {
      console.error('Error exporting scenario:', error);
      res.status(500).json({ error: 'Failed to export scenario' });
    }
  });

  // used to check whether or not the state of residence entered by the user is in the database already
  app.get('/checkState', async (req, res) => {
    const { state, userId } = req.query; 
  
    try {
      // find the user and populate their files
      const user = await User.findById(userId).populate({
        path: 'uploadedFiles',
        populate: {
          path: 'stateTaxes',
          match: { state }, 
          populate: [
            { path: 'singleIncomeTaxBrackets' },
            { path: 'marriedIncomeTaxBrackets' },
          ],
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // check if any StateTaxFile contains a statetax document for the specified state
      const stateTaxFile = user.uploadedFiles.find((file) =>
        file.stateTaxes.some((stateTax) => stateTax.state === state)
      );
  
      if (stateTaxFile) {
        // find the StateTax document for the specified state
        const stateTax = stateTaxFile.stateTaxes.find((stateTax) => stateTax.state === state);
        res.json({ exists: true, stateTax });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking state:', error);
      res.status(500).json({ error: 'Failed to check state' });
    }
  });

  app.post('/uploadStateTax', upload.single('file'), async (req, res) => {
    const file = req.file; // access the uploaded file
    const { userId } = req.query; 
  
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
  
    try {
      // import the state tax data and link it to the user
      const result = await importStateTaxBracketsFromYaml(file, userId);
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: 'Failed to upload file.', error: error.message });
    }
  });

  // used for uploading state tax files in the case where there is no information about that state
  app.get('/user/downloadFile', async (req, res) => {
    const { userId, fileId } = req.query;
  
    try {
      // find the user and ensure they have access to the file
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // find the StateTaxFile document
      const stateTaxFile = await File.findById(fileId);
      if (!stateTaxFile) {
        return res.status(404).json({ success: false, message: 'File not found.' });
      }
  
      // generate the YAML data using the StateTaxFile
      const yamlData = await exportStateTaxBracketsToYaml(stateTaxFile);
  
      // send the YAML file as a downloadable response
      res.setHeader('Content-Type', 'application/yaml');
      res.setHeader('Content-Disposition', `attachment; filename=${stateTaxFile.fileName || 'state_tax_data.yaml'}`);
      res.send(yamlData);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ success: false, message: 'Failed to download file.', error: error.message });
    }
  });

  app.delete('/user/deleteFile', async (req, res) => {
    const { userId, fileId } = req.query;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // check if the file belongs to the user
      if (!user.uploadedFiles.includes(fileId)) {
        return res.status(403).json({ success: false, message: 'You do not have access to this file.' });
      }
  
      // find the StateTaxFile document
      const stateTaxFile = await File.findById(fileId);
      if (!stateTaxFile) {
        return res.status(404).json({ success: false, message: 'File not found.' });
      }
  
      // fetch all associated StateTax documents
      const stateTaxes = await StateTax.find({ _id: { $in: stateTaxFile.stateTaxes } });
  
      // extract all IDs from the StateTax documents
      const taxBracketIds = stateTaxes.flatMap(stateTax => [
        ...stateTax.singleIncomeTaxBrackets,
        ...stateTax.marriedIncomeTaxBrackets,
      ]);
  
      // delete all associated TaxBracket documents
      await TaxBracket.deleteMany({ _id: { $in: taxBracketIds } });
  
      // delete all associated StateTax documents
      await StateTax.deleteMany({ _id: { $in: stateTaxFile.stateTaxes } });
  
      // delete the StateTaxFile document
      await File.findByIdAndDelete(fileId);
  
      // remove the file reference from the user's uploadedFiles array
      await User.findByIdAndUpdate(userId, {
        $pull: { uploadedFiles: fileId },
      });
  
      res.json({ success: true, message: 'File and associated data deleted successfully.' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ success: false, message: 'Failed to delete file.', error: error.message });
    }
  });
  
  

    // used  to fetch user's uploaded state tax files
    app.get('/user/files', async (req, res) => {
        const { userId } = req.query;
      
        try {
          // Find the user and populate the uploadedFiles field
          const user = await User.findById(userId).populate('uploadedFiles');
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
          }
         
          res.json({ success: true, files: user.uploadedFiles });
          
        } catch (error) {
          console.error('Error fetching files:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch files.', error: error.message });
        }
      });

const server = app.listen(8000, () => {console.log("Server listening on port 8000...");});
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const User = require('./models/User');

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log("Server closed. Database instance disconnected.");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
});

//Init Passport and Setup
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

// Fetch User
app.get('/getUser/:id', async (req, res) => {
    const googleID = req.params.id;

    try{
        const user = await User.findOne( {googleID: googleID} )
        if (!user){
            res.status(401).send("User Not Found");
        }
        else res.status(200).send(user)
    }
    catch(err){
        console.error(err)
    }
})

module.exports = app;