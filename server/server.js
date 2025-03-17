const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/flp');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors());
app.use(express.json());
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