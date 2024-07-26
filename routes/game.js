const express = require('express');
const router = express.Router();
const Game = require('../models/Game.js');

/* GET URL Path /game/ */
router.get('/', async(req, res, next) => {
    try {
      const games = await Game.find();
      res.json(games); // Return all the games in the database
    } catch (err) { // Catch any error that might be thrown by the database
      next(err);
    }
});

/* POST URL Path /game/ */
router.post('/', async function (req, res, next){
  try {
    // Create a new game object with the fields being from the request
    const game = await Game.create({ 
      gameId: req.body.gameID,
      gameResult: req.body.gameResult,
      user: req.body.user,
      playerHand: req.body.playerHand,
      playerScore: req.body.playerScore,
      dealerHand: req.body.dealerHand,
      dealerScore: req.body.dealerScore
    });

    await game.save();
    res.status(201).json(game);
  } catch (err) { // Catch any error that might be thrown by the database
    next(err);
  }
});

module.exports = router;