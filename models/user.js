// Our schema and model for the user resource -----
// now we want our mongoose object to relate to our db
const mongoose = require('../utils/connection')


// destructuring the Schema and model functions form mongoose
const { Schema, model } = mongoose

// Define User Schema and create User model -------
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    } 
})

const User = model('User', userSchema)

module.exports = User