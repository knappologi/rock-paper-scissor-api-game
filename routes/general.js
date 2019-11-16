const express = require('express');
const router = express.Router();

// TA BORT SEN
const gameController = require('../controllers/rpsGame.js');

router.get('/hello', gameController.helloBaby);
router.get('/testName', (req, res, next) => {
    gameController.checkName(req, res, next);
});



/*
BÖRJA HÄRIFRÅN
*/

// if nothing is found
router.get('/', (req, res, next) => {
    res.send('<h1>Hello from general route /</h1>');
})



/*
// if nothing is found
router.use((req, res, next) => {
    res.status(404).send('<h2>404: Nothing here!</h2>');    //TODO: gör något snyggare här
})
*/

module.exports = router;