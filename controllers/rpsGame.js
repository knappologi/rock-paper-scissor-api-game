const gameCollection = require('../data/gameCollection');
let gameIndex = 1; //TODO: change to ULID / UUID
const rpsValues = require('./rpsValues');
const gameMoves = rpsValues.rpsGameMoves;
const gameState = rpsValues.rpsGameState;

exports.createNewRpsGame = (req, res, next) => {
  validateName(req, res);
  if (!res.headersSent) {
    const newGameId = initiateNewRpsGame(req.query.name);
    res.status(201).json({
      message: `Send the following url to a friend to join with a POST-request: http://localhost:3002/api/games/${newGameId}/join`,
      gameId: newGameId
    });
  }
};

exports.joinGame = (req, res, next) => {
  validateName(req, res);
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
  gameToJoin.gameStatus = gameState.WAITING_FOR_MOVES;
  res.status(200).json({
    message: `Welcome to game ${gameToJoin.id}, ${playerName}!`
  });
};

exports.getGameStatus = (req, res, next) => {
  const gameToJoin = getGameById(req.params.id, res);
  if (!res.headersSent) {
    res.status(200).json({
      gameId: gameToJoin.id,
      gameStatus: gameToJoin.gameStatus,
      playerOne: gameToJoin.playerOne.name,
      playerTwo: gameToJoin.playerTwo.name
    });
  }
};

exports.addMove = (req, res) => {
  const game = getGameById(req.params.id, res);
  if (!res.headersSent) {
    if (
      game.gameStatus === gameState.WAITING_FOR_MOVES ||
      game.gameStatus === gameState.WAITING_FOR_PLAYER_ONE_MOVE ||
      game.gameStatus === gameState.WAITING_FOR_PLAYER_TWO_MOVE
    ) {
      validateMove(req, res);
      if (!res.headersSent) {
        const player = validatePlayer(req, res, game);
        if (player === '') {
          res.status(401).json({
            error: `Invalid player for game ${game.id}: ${req.query.name}`,
            gameId: game.id,
            gameStatus: game.gameStatus
          });
        } else {
          addPlayerMove(player, res, req.query.move, game);
        }
      }
    } else {
      res.status(401).json({
        error: `Invalid game state: ${game.gameStatus}`,
        gameId: game.id,
        gameStatus: game.gameStatus
      });
    }
  }
};

const validatePlayer = (req, res, game) => {
  validateName(req, res);
  if (!res.headersSent) {
    if (game.playerOne.name === req.query.name) {
      return game.playerOne;
    } else if (game.playerTwo.name === req.query.name) {
      return game.playerTwo;
    } else {
      return '';
    }
  }
};

const addPlayerMove = (player, res, move, game) => {
  if (player.move.length > 0) {
    res.status(401).json({
      error: `You've already made a move in this game!`,
      gameId: game.id,
      gameStatus: game.gameStatus
    });
  } else {
    player.move = move;
    validateGameState(res, game);
    res.status(200).json({ message: 'Your move has been recorded.' });
  }
};

const validateGameState = (res, game) => {
  if (game.playerOne.move.length > 0 && game.playerTwo.move.length === 0) {
    game.gameStatus = gameState.WAITING_FOR_PLAYER_TWO_MOVE;
  } else if (
    game.playerOne.move.length === 0 &&
    game.playerTwo.move.length > 0
  ) {
    game.gameStatus = gameState.WAITING_FOR_PLAYER_ONE_MOVE;
  } else {
    game.gameStatus = getFinalGameState(game);
  }
};

const validateName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: `Please provide your name as a parameter to create, join or make a move for a game!`
    });
  }
};

const validateMove = (req, res) => {
  if (!req.query.move || !gameMoves.includes(req.query.move.toLowerCase())) {
    return res.status(400).json({
      error: `Please provide a valid move (rock, paper or scissor) as a parameter.`
    });
  }
};

const getFinalGameState = game => {
  if (game.playerOne.move === game.playerTwo.move) {
    return gameState.DRAW; // Its a draw!
  }
  return checkWinner(game);
};

const checkWinner = game => {
  switch (game.playerOne.move) {
    case 'rock':
      return game.playerTwo.move === 'paper'
        ? gameState.PLAYER_TWO_WON
        : gameState.PLAYER_ONE_WON;
    case 'paper':
      return game.playerTwo.move === 'scissor'
        ? gameState.PLAYER_TWO_WON
        : gameState.PLAYER_ONE_WON;
    case 'scissor':
      return game.playerTwo.move === 'rock'
        ? gameState.PLAYER_TWO_WON
        : gameState.PLAYER_ONE_WON;
  }
};

const getGameById = (gameId, res) => {
  let foundGame = false;
  gameCollection.map(game => {
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
    gameStatus: gameState.INIT
  });
  gameIndex++; //TODO: change to ULID / UUID
  return gameIndex - 1;
};
