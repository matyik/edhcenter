const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add some content'],
    maxlength: [500, 'Comments must be under 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deck: {
    type: mongoose.Schema.ObjectId,
    ref: 'Deck',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Comment', CommentSchema)
