const express = require('express')

const advancedResults = require('../middleware/advancedResults')
const Deck = require('../models/Deck')
const {
  getDecks,
  getDeck,
  createDeck,
  editDeck,
  deleteDeck,
} = require('../controllers/decks')
const { protect } = require('../middleware/auth')

// Include comments resource
const commentRouter = require('./comments')

const router = express.Router({ mergeParams: true })

// Re-route into /comments
router.use('/:deckId/comments', commentRouter)

router.route('/').get(advancedResults(Deck), getDecks).post(protect, createDeck)

router
  .route('/:id')
  .get(getDeck)
  .put(protect, editDeck)
  .delete(protect, deleteDeck)

module.exports = router
