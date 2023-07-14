const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// File Schema defined for server

const fileSchema = new Schema({
    fieldname:{
        type: String,
    },
    originalname:{
        type: String,
    },
    encoding: {
        type: String,
    },
    mimetype: {
        type: String,
    },
    destination: {
        type: String,
    },
    filename: {
        type: String,
    },
    path:{
        type: String,
    },
    size:{
        type: Number,
    },
    createdAt:{
        type: Date,
        required:true,
        immutable: true,
        default: () => Date.now(),
    }
});

const File = mongoose.model('File' , fileSchema)
module.exports = File;