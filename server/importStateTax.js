const yaml = require('js-yaml');
const StateTax = require('./models/StateTax');
const TaxBracket = require('./models/TaxBracket');
const User = require('./models/User');
const File = require('./models/StateTaxFile'); // Import the File model

async function importStateTaxBracketsFromYaml(file, userId) {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file object. File buffer is missing.');
    }

    // Read and parse the YAML file
    const fileContents = file.buffer.toString('utf8');
    const stateTaxData = yaml.load(fileContents);

    // array to store references to all statetax docs created for this file
    const stateTaxReferences = [];

    // iterate over the data in the file
    for (const stateData of stateTaxData) {
      // insert tax brackets into their collections
      const singleBrackets = await TaxBracket.insertMany(stateData.singleIncomeTaxBrackets);
      const marriedBrackets = await TaxBracket.insertMany(stateData.marriedIncomeTaxBrackets);

      // create the new StateTax document
      const stateTax = new StateTax({
        state: stateData.state,
        singleIncomeTaxBrackets: singleBrackets.map(bracket => bracket._id),
        marriedIncomeTaxBrackets: marriedBrackets.map(bracket => bracket._id),
      });

      // save the StateTax document
      await stateTax.save();

      // add the StateTax reference to the array
      stateTaxReferences.push(stateTax._id);
    }

    // create a new file document to represent the uploaded file
    const fileDocument = new File({
      fileName: file.originalname, 
      stateTaxes: stateTaxReferences, //link refs
    });

    // save the File document
    await fileDocument.save();

    // add the file reference to the user
    await User.findByIdAndUpdate(userId, {
      $push: { uploadedFiles: fileDocument._id }, 
    });

    return { success: true, message: 'State tax data imported successfully.' };
  } catch (error) {
    console.error('Error importing state tax brackets:', error);
    throw error; 
  }
}

module.exports = importStateTaxBracketsFromYaml;