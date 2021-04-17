const Deck = require('../models/Deck')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// GET /decks, public
exports.getDecks = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// GET /decks/:id, public
exports.getDeck = asyncHandler(async (req, res, next) => {
    const deck = await Deck.findById(req.params.id)

    if (!deck) return next(new ErrorResponse(`Deck not found with ID of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: deck })
})

// POST /decks, public
exports.createDeck = asyncHandler(async (req, res, next) => {
    // Add user
    req.body.user = req.user.id

    const deck = await Deck.create(req.body)
    res.status(201).json({
        success: true,
        data: deck
    })
})

// PUT /decks/:id, public
exports.editDeck = asyncHandler(async (req, res, next) => {
    let deck = await Deck.findById(req.params.id)

    // Make sure user is deck owner
    if (deck.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to edit this deck`), 401)
    }

    if (!deck) return next(new ErrorResponse(`Deck not found with ID of ${req.params.id}`, 404))

    deck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: deck })
})

// DELETE /decks/:id, public
exports.deleteDeck = asyncHandler(async (req, res, next) => {
    const deck = await Deck.findByIdAndDelete(req.params.id)

    if (!deck) return next(new ErrorResponse(`Deck not found with ID of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: {} })
})