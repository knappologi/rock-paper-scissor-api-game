const gameCollection = require('../data/gameCollection');

exports.helloBaby = (req, res, next) => {
   gameCollection.push({item: 'a new item'});
  res.status(200).json({ message: 'hello baby', data: gameCollection });
};

exports.checkName = (req, res, next) => {
  if (!req.query.name) {
    return res
      .status(404)
      .json({ message: `Please provide your name to create a new game!` });
  }

  res.send('Return url to new game!');
};


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