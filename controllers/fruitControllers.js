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


// PUT route -> Update - > updates a specific fruit
// PUT replaes the entire document with a new document from the req.body
// PATCH is able to update specifi fields at specif times, but it requires more code to ensure that it works properly.
router.put('/:id', (req, res) => {
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
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})


// DELETE route -> delete -> delete a specific fruit
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findByIdAndRemove(id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json(err)
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