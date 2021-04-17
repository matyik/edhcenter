const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Deck = require('../models/Deck')
const Comment = require('../models/Comment')

exports.getComments = asyncHandler(async (req, res, next) => {
  if (req.params.deckId) {
    const comments = await Comment.find({ deck: req.params.deckId })

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await (await Comment.findById(req.params.id)).populate({
    path: 'deck',
    select: 'name description',
  })
  if (!comment) {
    return next(
      new ErrorResponse(`No comment found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: comment })
})

exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.deck = req.params.deckId
  req.body.user = req.user.id

  const deck = await Deck.findById(req.params.deckId)
  if (!deck) {
    return next(
      new ErrorResponse(`No deck found with an Id of ${req.params.deckId}`, 404)
    )
  }

  const comment = await Comment.create(req.body)

  res.status(201).json({ success: true, data: comment })
})

exports.editComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id)
  if (!comment) {
    return next(
      new ErrorResponse(`No comment found with an Id of ${req.params.id}`, 404)
    )
  }

  // Make sure comment belongs to user or user is an admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update comment', 401))
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: comment })
})

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id)
  if (!comment) {
    return next(
      new ErrorResponse(`No comment found with an Id of ${req.params.id}`, 404)
    )
  }

  // Make sure comment belongs to user or user is an admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update comment', 401))
  }

  await comment.remove()

  res.status(200).json({ success: true })
})
