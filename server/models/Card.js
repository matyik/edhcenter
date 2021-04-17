const mongoose = require('mongoose')
const slugify = require('slugify')

const CardSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image_uris: {
    normal: String
  },
  mana_cost: String,
  cmc: Number,
  type_line: String,
  legalities: {
    commander: String
  },
  reserved: Boolean,
  set_name: String,
  edhrec_rank: Number,
  prices: {
    usd: String,
    usd_foil: String
  },
  originalCard: {
    type: Boolean,
    default: true
  }
})

// Create slug from name
CardSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

module.exports = mongoose.model('Card', CardSchema)
