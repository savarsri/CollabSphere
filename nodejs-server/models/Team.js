const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Post Schema defined for Team

// const postSchema = new Schema({
//     content: {
//         type: String,
//         required: true,
//     },
//     attachments:[{
//         name: String,
//         fileType: String,
//         size: Number,
//     }],
//     createdBy: {
//         type: mongoose.SchemaTypes.ObjectId,
//         required: true,
//         ref: "User",
//         immutable: true,
//     },
//     team: {
//         type: mongoose.SchemaTypes.ObjectId,
//         required: true,
//         ref: "Team",
//         immutable: true,
//     }
// },{timestamps: true})

// Team schema defined

const teamSchema = new Schema({
    name: {
        type: String,
        maxLength: 30,
        minLength: 1,
        required: true,
        immutable: true,
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
        immutable: true,
    },
    code: {
        type: String,
        length: 6,
        required: true,
        immutable: true,
        unique: true
    },
    admin: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true,
        ref: "User",
    },
    posts: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Post",
    },
    files: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "File",
    },
    members: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    assignment: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Assignment',
    },
},{timestamps: true})

const Team = mongoose.model('Team' , teamSchema);
// const Post = mongoose.model('Post' , postSchema)
module.exports = Team