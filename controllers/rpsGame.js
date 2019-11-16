const gameCollection = require('../data/gameCollection');
let gameIndex = 1; //TODO: change to ULID / UUID

exports.helloBaby = (req, res, next) => {
  gameCollection.push({ item: 'a new item' });
  res.status(200).json({ message: 'hello baby', data: gameCollection });
};

exports.createNewRpsGame = (req, res, next) => {
  checkName(req, res, next);
  if (!res.headersSent) {
    const newGameId = initiateNewRpsGame(req.query.name);
    res.status(200).json({
      message: `Send the following url to a friend to join with a POST-request: http://localhost:3002/api/games/${newGameId}/join`
    });
  }
};

exports.joinGame = (req, res, next) => {
  checkName(req, res, next);
  const gameToJoin = getGameById(req.params.id);
  if (!res.headersSent && !gameToJoin) {
    res.send(`No game with id ${req.params.id} found!`);
  } else if (gameToJoin.playerTwo.length > 0) {
    res
      .status(401)
      .json({ error: `Game ${req.params.id} is full. Try join another game!` });
  } else {
    gameToJoin.playerTwo = req.query.name;
    gameToJoin.gameStatus = 'Waiting for both players moves.';
    if (!res.headersSent) {
      res.status(200).json({
        message: `Welcome to game ${req.params.id}, ${req.query.name}!`
      });
    }
  } 
};

exports.getGameStatus = (req, res, next) => {
  // checkName(req, res, next);
  if (!getGameById(req.params.id)) {
    res.send(`No game with id ${req.params.id} found!`);
  }
  if (!res.headersSent) {
    //
  }
};

const checkName = (req, res, next) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: `Please provide your name as a parameter to create or join a game!`
    });
  }
};

const checkGameIdNEWER = gameId => {
  gameCollection.map(game => {
    console.log(game.id);
    console.log(+game.id == +gameId);
    if (game.id == gameId) {
      console.log(game);
      return game;
    }
  });
};

const getGameById = gameId => {
  let foundGame = false;
  gameCollection.forEach(game => {
    if (+game.id === +gameId) {
      foundGame = game;
    }
  });
  return foundGame;
};

const initiateNewRpsGame = playerName => {
  gameCollection.push({
    id: gameIndex,
    playerOne: playerName,
    playerTwo: '',
    gameStatus: 'Game initated, waiting for player two to join.'
  });
  gameIndex++; //TODO: change to ULID / UUID
  return gameIndex - 1;
};

// status 201 = success, resource created

function checkGameIdOLD(req, res, next) {
  console.log(req.params);
  if (!req.params.id) {
    return res.status(404).json({ message: `No game ID provided!` });
  }
  const gameId = req.params.id; // Convert to number
  if (
    games.map(game => {
      if (game.id == gameId) {
        next();
        // res.json(`ID is ${gameId}`);
      }
    })
  )
    return res
      .status(404)
      .json({ message: `No game with ID ${gameId} found!` });
}
