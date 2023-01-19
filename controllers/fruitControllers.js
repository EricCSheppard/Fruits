// Import Dependencies -------------------------
const express = require('express') // import the express framework
const Fruit = require('../models/fruit')

// Create Router -------------------------------
const router = express.Router()

// Routes ------------------------------------
// router.get('/', (req, res) => {
//     res.send('Server is live, ready for requests')
// })

// INDEX route -> READ -> finds and displays all fruits

router.get('/', (req, res) => {
    // find all the fruits
    Fruit.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', '-password')
        // send json if sucessful
        .then(fruits => { res.json({ fruits: fruits })})
        // catch errors if they occur
        .catch(err => console.log('the following error occurredL \n', err))
})

// CREATE route -> Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // here we'll have something called a "request body"
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our fruit
    // luckily for us, we saved the user's id on the session object, so it's easy to access that data
    req.body.owner = req.session.userId
    const newFruit = req.body
    Fruit.create(newFruit)
    // send a 201 status, along with the json response of the new fruit
    .then(fruit => {
        res.status(201).json({ fruit: fruit.toObject() })
    })
    //send an error if one occurs
    .catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's fruits
router.get('/mine', (req, res) => {
    // find fruits by ownership, using the req.session info
    Fruit.find({ owner: req.session.userId })
        .populate('owner', '-password')
        .then(fruits => {
            // if found, display the fruits
            res.status(200).json({ fruits: fruits })
        })
        // otherwise, throw an error
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

//PUT route
// Update -> updates a specific fruit(only if the fruit's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
    .then(fruit => {
        // if the owner of the fruit is the person who is logged in
        if (fruit.owner == req.session.userId) {
            // send success message
            res.sendStatus(204)
            // update and save the fruit
            return fruit.updateOne(req.body)
        } else {
            //otherwise send a 401 unauthorized status
            res.sendStatus(401)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})


// DELETE route -> delete -> delete a specific fruit
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
    .then(fruit => {
        // if the owner of the fruit is the person who is logged in
        if (fruit.owner == req.session.userId) {
            // send success message
            res.sendStatus(204)
            // delete the fruit
            return fruit.deleteOne()
        } else {
            //otherwise send a 401 unauthorized status
            res.sendStatus(401)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// SHOW route -> Read -> finds and displays a single resource.
router.get('/:id', (req, res) => {
    //get the ID -> save to a variable
    const id = req.params.id
    //use a mongoose method to find using that id
    Fruit.findById(id)
    //send the fruit as json upon success
    .then(fruit => {
        res.json({ fruit: fruit })
    })
    //catch any errors
    .catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})

// Export Router -------------------------------
module.exports = router