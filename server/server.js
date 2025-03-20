require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./passport');
const cookieParser = require('cookie-parser')
const InvestmentTypeModel = require('./models/InvestmentType')
const ScenarioModel = require('./models/Scenario')


//stuff for importing/exporting
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const importScenarioFromYAML = require('./importScenario');
const exportScenarioToYAML= require('./exportScenario'); 


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

app.post("/submitInvestmentType", async (req, res) => {
    try {
        const form = req.body.form;

        console.log(form)
        const existingType = await InvestmentTypeModel.findOne({ name: form.name });

        if (existingType) {
            return res.status(400).send({ message: "Investment type already exists.." });
        }

        const newInvestmentType = new InvestmentTypeModel(form);
        await newInvestmentType.save();

        res.send({ message: "Investment type successfully added.." });
    } catch (error) {
        console.error("Error submitting investment type.", error);
        res.status(500).send({ message: "Error submitting investment type" });
    }
});

app.post('/import-scenario', upload.single('scenarioFile'), async (req, res) => {
    try {
      const { userId } = req.body; // get user id from the request
  
      // validate the user id
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // read the file content
      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath, 'utf8');
  
      // log the file content (for testing)
      console.log('Uploaded file content:', fileContent);
  
      // import scenario from the yaml
      const scenario = await importScenarioFromYAML(fileContent, userId);
  
      res.status(201).json({ message: 'Scenario imported successfully', scenario });
    } catch (error) {
      console.error('Error importing scenario:', error);
      res.status(500).json({ error: 'Failed to import scenario', details: error.message });
    } finally {
      // delete the file we dont need it anymore
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
    }
  });

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

  app.get('/export-scenario/:scenarioId', async (req, res) => {
    try {
      const { scenarioId } = req.params;
  
      // Export the scenario to YAML
      const yamlString = await exportScenarioToYAML(scenarioId);
  
      // Set headers for file download
      res.setHeader('Content-Type', 'application/yaml');
      res.setHeader('Content-Disposition', `attachment; filename="scenario-${scenarioId}.yaml"`);
  
      // Send the YAML string as the response
      res.send(yamlString);
    } catch (error) {
      console.error('Error exporting scenario:', error);
      res.status(500).json({ error: 'Failed to export scenario' });
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
        res.status(200).send(user)
    }
    catch(err){
        console.error(err)
    }
})

module.exports = app;