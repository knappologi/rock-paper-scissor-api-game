const express = require('express');
const router = express.Router();
const gameController = require('../controllers/rpsGame.js');

/**
 * GET api/games/help
 * Description of how to play
 */
router.get('/help', (req, res) => {
  res.status(200).json({
    message: `To create a game, use a POST request with your name as a parameter to /api/games/. Player two can then join the game through a POST request to /api/games/{id}/join with their name.
  Moves are made through POST requests to /api/games/{id}/move where name and move are required parameters. Valid moves are rock, paper, scissor. The status of the game can be fetched any time during the game through a GET request to /api/games/{id}`
  });
});

/**
 * POST to /api/games/
 * Required: player name.
 * Returns: game ID for new RPS game
 */
router.post('/', (req, res) => {
  gameController.createNewRpsGame(req, res);
});

/**
 * POST /api/games/{id}/join
 * Required: valid game ID and player name.
 * Returns: success message or error message
 */
router.post('/:id/join', (req, res) => {
  gameController.joinGame(req, res);
});

/**
 * GET /api/games/{id}
 * Required: valid game ID
 * Returns: game status, player names and game id. If the game is finished, also the players moves.
 */
router.get('/:id', (req, res) => {
  gameController.getGameStatus(req, res);
});

/**
 * POST /api/games/{id}/move
 * Required: valid game ID, player name and valid move.
 * Returns: success message or error message
 */
router.post('/:id/move', (req, res) => {
  gameController.addMove(req, res);
});

module.exports = router;
