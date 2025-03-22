const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    stateTaxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StateTax', required: true }], // Array of references to StateTax documents
    uploadDate: { type: Date, default: Date.now }, // Date of upload
  });

const File = mongoose.model('StateTaxFile', FileSchema);
module.exports = File;