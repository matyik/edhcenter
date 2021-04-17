const Card = require('../models/Card')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

exports.getCards = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

exports.getCard = asyncHandler(async (req, res, next) => {
    const card = await Card.findOne({ 'name': req.params.name })

    if (!card) return next(new ErrorResponse(`No card named ${req.params.name} found`), 404)

    res.status(200).json({ success: true, data: card })
})