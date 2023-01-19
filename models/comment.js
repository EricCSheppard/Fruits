// Schema for the comment subdocument ----------------
const { trusted } = require('mongoose')
const mongoose = require('../utils/connection')


// all we need from mongoose to build subdocuments is the schema constructor.
// SUBDOCUMENTS ARE NOT MONGOOSE MODELS
// destructure the schema function from mongoose
const { Schema } = mongoose

const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = commentSchema
