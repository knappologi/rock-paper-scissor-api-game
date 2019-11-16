const express = require('express');
const router = express.Router();
const gameController = require('../controllers/rpsGame.js');

/*
POST to /api/games/
Required: player name.
Returns: game ID for new RPS game
*/
router.post('/', (req, res) => {
  gameController.createNewRpsGame(req, res);
});

/*
POST /api/games/{id}/join 
Required: valid game ID and player name.
Returns: success message or error message (bad request)
*/
router.post('/:id/join', (req, res) => {
  gameController.joinGame(req, res);
});

/*
GET /api/games/{id}
Required: valid game ID 
Returns: game status, player names and game id
*/
router.get('/:id', (req, res) => {
  gameController.getGameStatus(req, res);
});

/*
POST /api/games/{id}/move
Required: valid game ID, player name and valid move.
Returns: success message or error message (bad request)
*/
router.post('/:id/move', (req, res) => {
  gameController.addMove(req, res);
});

module.exports = router;
