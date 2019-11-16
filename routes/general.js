const express = require('express');
const router = express.Router();

/*
BÖRJA HÄRIFRÅN
*/

// if nothing is found
router.get('/', (req, res) => {
  res.send('<h1>Hello from general route /</h1>');
});

/*
// if nothing is found
router.use((req, res, next) => {
    res.status(404).send('<h2>404: Nothing here!</h2>');    //TODO: gör något snyggare här
})
*/

module.exports = router;
