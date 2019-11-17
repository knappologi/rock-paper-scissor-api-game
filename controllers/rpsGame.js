const uuid = require('uuid/v4');
const gameCollection = require('../data/gameCollection');
const rpsValues = require('./rpsValues');
const gameMoves = rpsValues.rpsGameMoves;
const gameState = rpsValues.rpsGameState;

exports.createNewRpsGame = (req, res) => {
  validateName(req, res);
  if (!res.headersSent) {
    const newGameId = initiateNewRpsGame(req.query.name, res);
    res.status(200).json({
      message: `Send the following url to a friend to join with a POST-request: http://localhost:3002/api/games/${newGameId}/join`,
      gameId: newGameId
    });
  }
};

exports.getGameStatus = (req, res) => {
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

exports.joinGame = (req, res) => {
  validateName(req, res);
  if (!res.headersSent) {
    const gameToJoin = getGameById(req.params.id, res);
    if (!res.headersSent) {
      //TODO: Check error handling
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

exports.addMove = (req, res) => {
  const game = getGameById(req.params.id, res);
  if (!res.headersSent) {
    if (
      game.gameStatus === gameState.WAITING_FOR_MOVES ||
      game.gameStatus === gameState.WAITING_FOR_PLAYER_ONE_MOVE ||
      game.gameStatus === gameState.WAITING_FOR_PLAYER_TWO_MOVE
    ) {
      if (validateMove(req, res)) {
        const player = validatePlayer(req, res, game);
        if (!res.headersSent) {
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

const validateGameState = (res, game) => {
  if (game.playerOne.move.length > 0 && game.playerTwo.move === '') {
    game.gameStatus = gameState.WAITING_FOR_PLAYER_TWO_MOVE;
  } else if (game.playerOne.move === '' && game.playerTwo.move.length > 0) {
    game.gameStatus = gameState.WAITING_FOR_PLAYER_ONE_MOVE;
  } else {
    game.gameStatus = getFinalGameState(game);
  }
};

const validateMove = (req, res) => {
  if (!req.query.move || !gameMoves.includes(req.query.move.toLowerCase())) {
    res.status(404).json({
      error: `Please provide a valid move (rock, paper or scissor) as a parameter.`
    });
    return false;
  } else {
    return true;
  }
};

const validateName = (req, res) => {
  if (!req.query.name) {
    return res.status(404).json({
      error: `Please provide your name as a parameter to create, join or make a move for a game!`
    });
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

const initiateNewRpsGame = (playerName, res) => {
  const newGameId = uuid();
  try {
    gameCollection.push({
      id: newGameId,
      playerOne: { name: playerName, move: '' },
      playerTwo: { name: '', move: '' },
      gameStatus: gameState.INIT
    });
    return newGameId;
  } catch (error) {
    console.trace(error);
    return res.status(500).json({
      error: `Oh no, something went wrong! Failed to create a new game.`
    });
  }
};

const addPlayerToGame = (gameToJoin, playerName, res) => {
  gameToJoin.playerTwo = { name: playerName, move: '' };
  gameToJoin.gameStatus = gameState.WAITING_FOR_MOVES;
  res.status(200).json({
    message: `Welcome to game ${gameToJoin.id}, ${playerName}!`
  });
};

const getGameById = (gameId, res) => {
  let foundGame = false;
  try {
    gameCollection.map(game => {
      if (game.id === gameId) {
        foundGame = game;
      }
    });
  } catch (error) {
    // In case something went wrong with gameCollection or fetching game, catch and log error
    console.trace(error);
    return res.status(500).json({
      error: `Oh no, something went wrong! Failed to fetch game ID ${gameId}.`
    });
  }
  if (!foundGame) {
    res.status(404).json({error: `No game with id ${gameId} found!`});
  }
  return foundGame;
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
    res.status(200).json({ message: `Your move (${move}) has been recorded.` });
  }
};
