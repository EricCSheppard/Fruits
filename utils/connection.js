
require('dotenv').config() // Load ENV file's variables
const mongoose = require('mongoose') // import the mongoose library


// This is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// Here is our db config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG)

// Tell mongoose what to do with certain events
// What happens when we open, disconnect, or get an error
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))

module.exports = mongoose