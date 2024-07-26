const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameResult: String, // Holds the String version of the result (e.g. "You win!!!")
    user: String, // The user currently logged in
    playerHand: Array, // The player's ending hand
    playerScore: Number, // The player's score
    dealerHand: Array, // The dealer's ending hand
    dealerScore: Number // The dealer's score
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
