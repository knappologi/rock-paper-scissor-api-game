const gameCollection = require('../data/gameCollection');
let gameIndex = 1; //TODO: change to ULID / UUID

exports.helloBaby = (req, res, next) => {
   gameCollection.push({item: 'a new item'});
  res.status(200).json({ message: 'hello baby', data: gameCollection });
};



exports.createNewRpsGame = (req, res, next) => {
  checkName(req, res, next);
  if (!res.headersSent) {
    const newGameId = initiateNewRpsGame(req.query.name);
    res.send(`Send the following url to a friend to join with a POST-request: http://localhost:3002/api/games/${newGameId}/join`);
  }
}

const checkName = (req, res, next) => {
  if (!req.query.name) {
    return res
      .status(400)
      .json({ error: `Please provide your name as a parameter to create a new game!` });
  }
};

const initiateNewRpsGame = (playerName) => {
  gameCollection.push({id: gameIndex, playerOne: playerName, playerTwo: '', gameStatus: 'Game initated, waiting for player two to join.'});
  gameIndex++;  //TODO: change to ULID / UUID
  return gameIndex - 1;
}


// status 201 = success, resource created



function checkGameId (req, res, next){
    console.log(req.params)
    if(!req.params.id) {
        return res.status(404).json({message: `No game ID provided!`});
    }
    const gameId = req.params.id;      // Convert to number
    if (games.map(game => {
        if (game.id == gameId) {
            next();
           // res.json(`ID is ${gameId}`);
        }
    }))
    return res.status(404).json({message: `No game with ID ${gameId} found!`});
}