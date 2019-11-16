const gameCollection = require('../data/gameCollection');
let gameIndex = 1; //TODO: change to ULID / UUID
const gameMoves = ['rock', 'paper', 'scissor'];
const gameState = [
  'In progress. Game initated, waiting for player two to join.',          //0
  'In progress. Player two has joined. Waiting for both players moves.',  //1
  'In progress. Waiting for player twos move.',                           //2
  'In progress. Waiting for player ones move.',                           //3
  'Game finished. Player one won!',                                       //4
  'Game finished. Player two won!',                                       //5
  'Game finished. It\'s a draw!'                                          //6
];

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
  gameToJoin.gameStatus = gameState[1];
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
      game.gameStatus === gameState[1] ||
      game.gameStatus === gameState[2] ||
      game.gameStatus === gameState[3]
    ) {
      checkMove(req, res);
      if (!res.headersSent) {
        const player = validatePlayer(req, res, game);
        if (player === 0) {
          res.status(401).json({
            error: `Invalid player for game ${game.id}: ${req.query.name}`,
            gameId: game.id,
            gameStatus: game.gameStatus
          });
        } else {
          const playerToAddMove = player === 1 ? game.playerOne : game.playerTwo;
          addPlayerMove(playerToAddMove, res, req.query.move, game);
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
  checkName(req, res);
  if (!res.headersSent) {
    if (game.playerOne.name === req.query.name) {
      return 1;
    } else if (game.playerTwo.name === req.query.name) {
      return 2;
    } else {
      return 0;
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
    res.status(200).json({message: 'Your move has been recorded.'})
  }
};

const validateGameState = (res, game) => {
  if (game.playerOne.move.length > 0 && game.playerTwo.move.length === 0) {
    game.gameStatus = gameState[2];
  } else if (game.playerOne.move.length === 0 && game.playerTwo.move.length > 0) {
    game.gameStatus = gameState[3];
  } else {
    game.gameStatus = checkPlayerMoves(game);
  }
}

const checkName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({
      error: `Please provide your name as a parameter to create or join a game!`
    });
  }
};

const checkMove = (req, res) => {
  if (!req.query.move || !gameMoves.includes(req.query.move.toLowerCase())) {
    return res.status(400).json({
      error: `Please provide a valid move (rock, paper or scissor) as a parameter.`
    });
  }
};

const checkPlayerMoves = (game) => {
  console.log('in checkPlayerMove')
  if (game.playerOne.move === game.playerTwo.move) {
    return gameState[6]; // Its a draw!
  }
}

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
    gameStatus: gameState[0]
  });
  gameIndex++; //TODO: change to ULID / UUID
  return gameIndex - 1;
};
