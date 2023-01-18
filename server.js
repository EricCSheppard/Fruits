// Import Dependencies -------------------------
const express = require('express') // import the express framework
// const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config()  // load my ENV file's variables
const path = require('path') // import path module
// const { ppid } = require('process')
// const router = require('./controllers/fruitControllers')
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')

// Create our Express App Object ----------------------
const app = express()

middleware(app)

// Routes ------------------------------------------
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

//this is now where we register our routes, this is how server.js knows to send the correct response.
// app/use when we register a route, needs two arguments
//the first arg is the base URL, second arg is the file to use
app.use('/fruits', FruitRouter)
app.use('/users', UserRouter)


// Create our server listener --------------------------
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
// END -------------------------------------------------