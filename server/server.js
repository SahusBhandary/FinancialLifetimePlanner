const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const InvestmentTypeModel = require('./models/InvestmentType')

mongoose.connect('mongodb://127.0.0.1:27017/flp');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors());
app.use(express.json());

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


const server = app.listen(8000, () => {console.log("Server listening on port 8000...");});


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

module.exports = app;