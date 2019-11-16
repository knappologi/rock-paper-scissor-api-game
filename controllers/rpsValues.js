exports.rpsGameState = {
    INIT: 'In progress. Game initated, waiting for player two to join.',                       //0
    WAITING_FOR_MOVES: 'In progress. Player two has joined. Waiting for both players moves.',  //1
    WAITING_FOR_PLAYER_TWO_MOVE: 'In progress. Waiting for player twos move.',                 //2
    WAITING_FOR_PLAYER_ONE_MOVE: 'In progress. Waiting for player ones move.',                 //3
    PLAYER_ONE_WON: 'Game finished. Player one won!',                                          //4
    PLAYER_TWO_WON:'Game finished. Player two won!',                                           //5
    DRAW: 'Game finished. It\'s a draw!'                                                       //6
}
Object.freeze(this.rpsGameState);

exports.rpsGameMoves = [
    'rock', 'paper', 'scissor'
]
Object.freeze(this.rpsGameMoves);