require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./passport');
const cookieParser = require('cookie-parser')

const InvestmentTypeModel = require('./models/InvestmentType')
const UserModel = require('./models/User')
const EventSeriesModel = require('./models/EventSeries')
const InvestmentModel = require('./models/Investment')


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


app.post("/getInvestments", async (req, res) => {
    try {
        const { investmentIds } = req.body;


        const investments = await InvestmentTypeModel.find({
            _id: { $in: investmentIds }
        });

        console.log(investments);
        res.status(200).send(investments);

    } catch (error) {
        console.error("Error retrieving investments.", error);
        res.status(500).send({ message: "Error retrieving investments." });
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