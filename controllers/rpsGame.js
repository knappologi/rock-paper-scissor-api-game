const gameCollection = require('../data/gameCollection');
let gameIndex = 1; //TODO: change to ULID / UUID

exports.helloBaby = (req, res, next) => {
  gameCollection.push({ item: 'a new item' });
  res.status(200).json({ message: 'hello baby', data: gameCollection });
};

exports.createNewRpsGame = (req, res, next) => {
  checkName(req, res);
  if (!res.headersSent) {
    const newGameId = initiateNewRpsGame(req.query.name);
    res.status(201).json({
      message: `Send the following url to a friend to join with a POST-request: http://localhost:3002/api/games/${newGameId}/join`,
      gameId: newGameId
    });
  }
};

exports.joinGame = (req, res, next) => {
  checkName(req, res);
  if (!res.headersSent) {
    const gameToJoin = getGameById(req.params.id, res);
    if (!res.headersSent) {
      if (gameToJoin.playerTwo.name.length > 0) {
        res.status(401).json({
          error: `Game ${req.params.id} is full. Try joining another game!`
        });
      } else if (gameToJoin) {
        addPlayerToGame(gameToJoin, req.query.name, res);
      }
    }
  }
};

const addPlayerToGame = (gameToJoin, playerName, res) => {
  gameToJoin.playerTwo = { name: playerName, move: '' };
  gameToJoin.gameStatus =
    'In progress. Player two has joined. Waiting for both players moves.';
  res.status(200).json({
    message: `Welcome to game ${gameToJoin.id}, ${playerName}!`
  });
};

exports.getGameStatus = (req, res, next) => {
  const gameToJoin = getGameById(req.params.id, res);
  if (!res.headersSent) {
    res
      .status(200)
      .json({
        gameId: gameToJoin.id,
        gameStatus: gameToJoin.gameStatus,
        playerOne: gameToJoin.playerOne.name,
        playerTwo: gameToJoin.playerTwo.name
      });
  }
};

const checkName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: `Please provide your name as a parameter to create or join a game!`
    });
  }
};

const getGameById = (gameId, res) => {
  let foundGame = false;
  gameCollection.forEach(game => {
    if (+game.id === +gameId) {
      foundGame = game;
    }
  });
  if (!foundGame) {
    res.send(`No game with id ${gameId} found!`);
  }
  return foundGame;
};

const initiateNewRpsGame = playerName => {
  gameCollection.push({
    id: gameIndex,
    playerOne: { name: playerName, move: '' },
    playerTwo: { name: '', move: '' },
    gameStatus: 'In progress. Game initated, waiting for player two to join.'
  });
  gameIndex++; //TODO: change to ULID / UUID
  return gameIndex - 1;
};

// status 201 = success, resource created
