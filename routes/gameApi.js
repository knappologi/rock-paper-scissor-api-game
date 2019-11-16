const express = require('express');
const router = express.Router();
const gameController = require('../controllers/rpsGame.js');




/*
POST to /api/games/
Required: player name.
Returns: game ID for new RPS game
*/
router.post('/', (req, res, next) => {
  gameController.createNewRpsGame(req, res, next);
});



/*
POST /api/games/{id}/join 
Required: valid game ID and player name.
Returns: success message or error message (bad request)
*/
router.post('/:id/join', (req, res, next) => {
  gameController.joinGame(req, res, next);
});

/*
GET /api/games/{id}/join 
Required: valid game ID and player name.
Returns: success message or error message (bad request)
*/
router.get('/:id', (req, res, next) => {
  gameController.getGameStatus(req, res, next);
});











/*
OLD BELOW 
*/

const gamesCollection = {
  games: [
    { id: '00', playerOne: 'Bobby', playerTwo: 'Helen' },
    { id: '01', playerOne: 'Calle', playerTwo: 'Karin' }
  ]
};

function checkGameId(req, res, next) {
  console.log(req.params);
  if (!req.params.id) {
    return res.status(404).json({ message: `No game ID provided!` });
  }
  const gameId = req.params.id; // Convert to number
  let doesGameExists = false;
  gamesCollection.games.map(game => {
    if (game.id == gameId) {
      console.log('found game!');
      doesGameExists = true;
      next();
      // res.json(`ID is ${gameId}`);
    }
  });
  if (!doesGameExists) {
    return res
      .status(404)
      .json({ message: `No game with game ID ${gameId} found!` });
  }
}

router.get('/', (req, res, next) => {
  res.send('Wow so cute!');
});



// POST /api/games/{id}/join
// Ansluter till ett spel med givet ID. Ange spelarnamn i request-body:
router.post('/:id/move', (req, res, next) => {
  if (req.params.id == null) {
    res
      .status(404)
      .json({ message: `To join the game, please add a player name.` });
  }
  const gameId = req.params.id; // Convert to number
  if (
    gamesCollection.games.map(game => {
      if (game.id === gameId) {
        res.json(`ID is ${gameId}`);
      }
    })
  )
    return res
      .status(404)
      .json({ message: `No game with ID ${gameId} found!` });
});

// POST api/games/{id}/move
// Gör ett drag. Ange namn och drag i request-body: (param name & move)
router.post('/:id/move', (req, res, next) => {
  const gameId = +req.params.id; // Convert to number
  if (
    gamesCollection.games.map(game => {
      if (game.id === gameId) {
        res.json(`ID is ${gameId}`);
      }
    })
  )
    return res
      .status(404)
      .json({ message: `No game with ID ${gameId} found!` });
});

module.exports = router;
