const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Load models
const Deck = require('./models/Deck')
// const User = require('./models/User')
const Card = require('./models/Card')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// Read the JSON files
const decks = JSON.parse(fs.readFileSync(`${__dirname}/_data/decks.json`, 'utf-8'))
// const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const cards = JSON.parse(fs.readFileSync(`${__dirname}/_data/scryfall_card_data.json`, 'utf-8'))

// Import into DB
const importData = async () => {
    try {
        await Deck.create(decks)
        await Card.create(cards)
        // await User.create(users)

        console.log('Data imported...'.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

const deleteData = async () => {
    try {
        await Deck.deleteMany()
        // await User.deleteMany()
        await Card.deleteMany()

        console.log('Data destroyed...'.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i' || process.argv === '--import') {
    importData()
} else if (process.argv[2] === '-d' || process.argv === '--delete') {
    deleteData()
}