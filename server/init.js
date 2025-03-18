/* server/init.JSON
** You must write a script that will create documents in your database according
** to the datamodel you have defined for the application.  Remember that you 
** must at least initialize an admin user account whose credentials are derived
** from command-line arguments passed to this script. But, you should also add
** some communities, posts, comments, and link-flairs to fill your application
** some initial content.  You can use the initializeDB.js script as inspiration, 
** but you cannot just copy and paste it--you script has to do more to handle
** users.
*/

// initializeDB.js - Will add initial application data to MongoDB database
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument
// (e.g., mongodb://127.0.0.1:27017/fake_so)

const mongoose = require('mongoose');
const UserModel = require('./models/User');


let mongoDB = 'mongodb://127.0.0.1:27017/flp';
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function createUser(userObj) {
    let newUser = new UserModel({
        name: userObj.name,
        email: userObj.email,
        age: userObj.age,
        stateOfResidence: userObj.stateOfResidence
    });
    return newUser.save();
}

async function initializeDB() {
    const user1 = {
        name: "meshane",
        email: "meshane.peiris@stonybrook.edu",
        age: 9,
        stateOfResidence: "New York"
    }
    let user1Ref = await createUser(user1)
}

initializeDB()
    .catch((err) => {
        console.log('ERROR: ' + err);
        console.trace();
        if (db) {
            db.close();
        }
    });

console.log('processing...');
mongoose.connection.close();