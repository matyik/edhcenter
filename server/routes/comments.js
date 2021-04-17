const express = require('express')

const {
  getComments,
  getComment,
  addComment,
  editComment,
  deleteComment,
} = require('../controllers/comments')
const Comment = require('../models/Comment')

const router = express.Router({ mergeParams: true })

const advancedResults = require('../middleware/advancedResults')
const { protect } = require('../middleware/auth')

router
  .route('/')
  .get(
    advancedResults(Comment, { path: 'deck', select: 'username description' }),
    getComments
  )
  .post(protect, addComment)

router
  .route('/:id')
  .get(getComment)
  .put(protect, editComment)
  .delete(protect, deleteComment)

module.exports = router
