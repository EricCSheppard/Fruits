// Import Dependencies -------------------------
const express = require('express') // import the express framework
const Fruit = require('../models/fruit')

// Create Router -------------------------------
const router = express.Router()

// Routes ---------------------------------------
// Subdocuments are not mongoose models, that means they don't have their own collection, and they don't come with the model methods we're used to(they have some of their own built in.)
// This also means that a subdoc is never going to be viewed without it's parent document.

// this also means, that when we make a subdocument, we must refer to the parent so that mongoose knows where in mongodb to store this subdocument.


// POST -> '/comments/<somefruitid>
// only loggedin users can post comments
// because we have to refer to a fruit, we'll do that in the simplest way via the route.
router.post('/:fruitId', (req, res) => {
    // first we get the fruitId and save it to a variable
    const fruitId = req.params.fruitId
    // then we'll protect this route against non-logged in users
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the comment
        // this is exactly like how we added the owner to our fruits
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // saves the req.body to a variable for easy reference later
    const theComment = req.body
    // find a specific fruit
    Fruit.findById(fruitId)
        .then(fruit => {
            // create the comment (with a req.body)
            fruit.comments.push(theComment)
            // save the fruit 
            return fruit.save()
        })
        .then(fruit => {
            res.status(201).json({ fruit: fruit })
        })
        // handle any errors
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
    
})

module.exports = router

