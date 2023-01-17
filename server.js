// Import Dependencies -------------------------
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config()  // load my ENV file's variables
const path = require('path') // import path module
const { ppid } = require('process')

// Import Our Models ---------------------------
const Fruit = require('./models/fruit')

// Database Connection ---------------------------
// this is where we will set up our inputs for our datacase connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// what happens when we open, disconnect, or get an error
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('Disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occured: \n', err))

// Create our Express App Object ----------------------
const app = express()

// Middleware ---------------------------------
// middleware runs before all the routes
// every request is processed through our middlewear before mongoose can do anything with it
app.use(morgan('tiny')) // this is for request logging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({ extended: true })) //this parses urlEncoded request bodies (useful for POST and PUT request)
app.use(express.static('public')) // this serves static files from the 'public' folder
app.use(express.json()) // parses incoming request payloads with JSON


// Routes ------------------------------------
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})


// we're going to build a seed route
// this will seed the database for us with a few started resources
// there are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they are best practices
app.get('/fruits/seed', (req, res) => {
    // array of starter resources (fruits)
    const startFruits = [
        { name: 'Orange', color: 'orange', readyToEat: true },
        { name: 'Grape', color: 'purple', readyToEat: true  },
        { name: 'Banana', color: 'yellow', readyToEat: false },
        { name: 'Strawberry', color: 'red', readyToEat: false },
        { name: 'Coconut', color: 'brown', readyToEat: true }
    ]
    // then we delete every fruit in the database(all instances of this resource)
    Fruit.deleteMany({})
        .then(() => {
            //then we'll seed (create) our starter fruits
            Fruit.create(startFruits)
                // tell our db what to do with success and failures
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log('the following error occurredL \n', err))
        })
})

// INDEX route -> READ -> finds and displays all fruits

app.get('/fruits', (req, res) => {
    // find all the fruits
    Fruit.find({})
        // send json if sucessful
        .then(fruits => { res.json({ fruits: fruits })})
        // catch errors if they occur
        .catch(err => console.log('the following error occurredL \n', err))


})

// CREATE route -> Create -> receives a request body, and creates a new document in the database
app.post('/fruits', (req, res) => {
    // here we'll have something called a "request body"
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    const newFruit = req.body
    Fruit.create(newFruit)
    // send a 201 status, along with the json response of the new fruit
    .then(fruit => {
        res.status(201).json({ fruit: fruit.toObject() })
    })
    //send an error if one occurs
    .catch(err => console.log(err))
})


// PUT route -> Update - > updates a specific fruit
// PUT replaes the entire document with a new document from the req.body
// PATCH is able to update specifi fields at specif times, but it requires more code to ensure that it works properly.
app.put('/fruits/:id', (req, res) => {
    // save the id to a variable for use later
    const id = req.params.id
    // save the request body to a variable for easy ref
    const updatedFruit = req.body
    // we're going to use the mongoose method:
    // findByIdAndUpdate
    // eventually we'll change how this route works, but for now we'll do everything in one shot.
    Fruit.findByIdAndUpdate(id, updatedFruit, { new: true })
        .then(fruit => {
            console.log('the newly updated fruit', fruit)
            // update sucess message will just be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


// DELETE route -> delete -> delete a specific fruit

// SHOW route -> Read -> finds and displays a single resource.
app.get('/fruits/:id', (req, res) => {
    //get the ID -> save to a variable
    const id = req.params.id
    //use a mongoose method to find using that id
    Fruit.findById(id)
    //send the fruit as json upon success
    .then(fruit => {
        res.json({ fruit: fruit })
    })
    //catch any errors
    .catch(err => console.log(err))
})


// Create our server listener ----------------------------
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
// END ---------------------------------------------------