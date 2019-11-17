const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const app = require('../app.js');
const gameCollection = require('../data/gameCollection.js');
const gameValues = require('../controllers/rpsValues.js');

chai.use(chaiHttp);

describe('Tests for POST /api/games', () => {
  it('should return 200 status response with a name paramater', done => {
    chai
      .request(app)
      .post('/api/games')
      .query({ name: 'testName' })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('gameId');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 404 status response due to missing name parameter', done => {
    chai
      .request(app)
      .post('/api/games')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should have added a game to the game collection', done => {
    const gameCollectionLength = gameCollection.length;
    chai
      .request(app)
      .post('/api/games')
      .query({ name: 'testName' })
      .end(function() {
        expect(gameCollection.length).to.be.equal(gameCollectionLength + 1);
        done();
      });
  });

  it('should have not have created a game due to missing name parameter', done => {
    const gameCollectionLength = gameCollection.length;
    chai
      .request(app)
      .post('/api/games')
      .end(() => {
        expect(gameCollection.length).to.be.equal(gameCollectionLength);
        done();
      });
  });
});

describe('Tests for GET /api/games/{id}', () => {
  it('should return 404 status response for invalid game id', done => {
    chai
      .request(app)
      .get('/api/games/2')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 200 status response for valid game id', done => {
    const validGameId = gameCollection[1].id; // fetch valid UUID
    chai
      .request(app)
      .get(`/api/games/${validGameId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('gameId');
        expect(res.body).to.have.property('gameStatus');
        expect(res.body).to.have.property('playerOne');
        expect(res.body).to.have.property('playerTwo');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should not have changed the game status by GET', done => {
    const game = gameCollection[0];
    chai
      .request(app)
      .get(`/api/games/${game.id}`)
      .end((err, res) => {
        expect(res.body.gameStatus).to.equal(game.gameStatus);
        done();
      });
  });
});

describe('Tests for POST /api/games/{id}/join', () => {
  it('should return 404 status response for invalid game id with name param', done => {
    chai
      .request(app)
      .post('/api/games/2/join') // Invalid id as gamecontroller generates UUID
      .query({ name: 'testName' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 404 status response for invalid game id and without name param', done => {
    chai
      .request(app)
      .post('/api/games/2/join') // Invalid id as gamecontroller generates UUID
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 404 when game id is valid but name is missing', done => {
    const gameId = gameCollection[0].id;
    chai
      .request(app)
      .post(`/api/games/${gameId}/join`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 200 when valid params for name and game id is used', done => {
    const gameId = gameCollection[0].id;
    chai
      .request(app)
      .post(`/api/games/${gameId}/join`)
      .query({ name: 'new player' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should have added a new player to game', done => {
    const game = gameCollection[1];
    chai
      .request(app)
      .post(`/api/games/${game.id}/join`)
      .query({ name: 'new player' })
      .end(() => {
        expect(game.playerTwo.name).to.be.equal('new player');
        expect(game.gameStatus).to.be.equal(
          gameValues.rpsGameState.WAITING_FOR_MOVES
        );
        done();
      });
  });
});

describe('Tests for POST /api/games/{id}/move', () => {
  it('should return 404 due to invalid game id', done => {
    chai
      .request(app)
      .post(`/api/games/2/move`)
      .query({ name: 'new player', move: 'rock' })
      .query({ move: 'rock' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 404 due to missing name param', done => {
    const gameId = gameCollection[0].id;
    chai
      .request(app)
      .post(`/api/games/${gameId}/move`)
      .query({ move: 'rock' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 404 due to missing move param', done => {
    const game = gameCollection[0];
    chai
      .request(app)
      .post(`/api/games/${game.id}/move`)
      .query({ name: `${game.playerOne.name}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 404 due to invalid move param', done => {
    const game = gameCollection[0];
    chai
      .request(app)
      .post(`/api/games/${game.id}/move`)
      .query({ name: `${game.playerOne.name}`, move: 'nothing' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 401 due invalid player name for the game', done => {
    const gameId = gameCollection[0].id;
    chai
      .request(app)
      .post(`/api/games/${gameId}/move`)
      .query({ name: 'invalid player', move: 'rock' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('gameId');
        expect(res.body).to.have.property('gameStatus');
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should record a move', done => {
    const game = gameCollection[0];
    chai
      .request(app)
      .post(`/api/games/${game.id}/move`)
      .query({ name: game.playerOne.name, move: 'rock' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        expect(game.playerOne.move).to.equal('rock');
        done();
      });
  });
});
