# Rock paper scissor game api
A two-player game using HTTP requests to create, join and participate in rock, paper, scissor.

## Prerequisites

NodeJS - https://nodejs.org/en/download/

## Getting started
Download/clone the repository
Open the project in VS Code or similar

### To run the server:

*  Run `npm run` to start the server on port 3002.

 HTTP requests can now be sent to http://localhost:3002

**For development:**
*  Run `npm start` to start the server on port 3002 with nodemon

To run tests:
*  Run `npm test` to run the tests

## Play the game
To play the game, the players can send HTTP requests to the server. HTTP requests can be sent using tools like Postman - https://www.getpostman.com/downloads/ or curl - https://curl.haxx.se/download.html

To create a game, use a POST request with your name as a parameter to /api/games/.

Player two can then join the game through a POST request to /api/games/{id}/join with their name.

Moves are made through POST requests to /api/games/{id}/move where name and move are required parameters. Valid moves are rock, paper, scissor. 

The status of the game can be fetched any time during the game through a GET request to /api/games/{id}

**Game rules**

Paper beats rock, rock beats scissor, and scissor beats paper. Its a draw if both players pick the same move. Each game only allows for two players, and a player cannot change an already made move. No moves will be recorded before player two has joined. 

### Available requests
**POST /api/games/**

Required parameters: name. Returns: message with url to send to another player, and game Id. Example: `http://localhost:3002/api/games?name=yourname`

**POST /api/games/{id}/join**

Required parameters: name. Returns: confirmation message Example: `http://localhost:3002/api/games/001/join?name=yourfriendsname`

**POST /api/games/{id}/move**

Required parameters: name and move. The name must match one of the games player. Returns: confirmation message. Example: `http://localhost:3002/api/games/001/move?name=yourname&move=scissor`

**GET /api/games/{id}**

Returns: game Id, game status, name of player one and two. Example: `http://localhost:3002/api/games/001/`

## Development & details
### Dependencies
* express
* uuid

Dev dependencies:
* chai
* chai-http
* eslint
* mocha
* nodemon

### Project structure
The server is run through app.js. Game logic can be found within the controller folder, routes in the routes folder and tests in test folder. This version of the game is storing all game data in the gameCollection.js in the data folder, within an array. 

### Possible future improvements
* Store the game data in a database
* Use ULID instead of UUID for more URL-friendly game IDs
* Add more tests
