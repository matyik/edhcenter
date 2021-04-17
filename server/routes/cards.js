const express = require('express')

const advancedResults = require('../middleware/advancedResults')
const Card = require('../models/Card')
const { getCards, getCard } = require('../controllers/cards')

const router = express.Router()

router.route('/').get(advancedResults(Card), getCards)
router.route('/:name').get(getCard)

module.exports = router