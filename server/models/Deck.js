const mongoose = require('mongoose')
const slugify = require('slugify')

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  deckArray: Array,
  commander: Array,
  basics: Array,
  colors: Array,
  private: Boolean,
  votes: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

// Create slug from name
DeckSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

module.exports = mongoose.model('Deck', DeckSchema)
