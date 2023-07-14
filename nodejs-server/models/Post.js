const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Post Schema defined for Team

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    files: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "File",
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
        immutable: true,
    },
    team: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Team",
        immutable: true,
    }
},{timestamps: true})

const Post = mongoose.model('Post' , postSchema)
module.exports = Post