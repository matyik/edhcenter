const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const formatMessage = require('./utils/messages')
const dotenv = require('dotenv')
const helmet = require('helmet')
const cors = require('cors')
const hpp = require('hpp')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const colors = require('colors')
const morgan = require('morgan')

const connectDB = require('./config/db')
const auth = require('./routes/auth')
const decks = require('./routes/decks')
const cards = require('./routes/cards')
const users = require('./routes/users')
const comments = require('./routes/comments')
const errorHandler = require('./middleware/error')

dotenv.config({ path: './config/config.env' })

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT),
  console.log(
    `API running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parser
app.use(express.json())

// Sanitize Data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// CORS
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 50
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

app.use('/api/decks', decks)
app.use('/api/auth', auth)
app.use('/api/cards', cards)
app.use('/api/users', users)
app.use('/api/comments', comments)

app.use(errorHandler)

// Unhandles promise rejections
process.on('unhandledRejection', () => (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server and exit process
  server.close(() => process.exit(1))
})

const GAME = 'Game'

io.on('connection', (socket) => {
  socket.on('message', ({ username, message }) => {
    io.emit('message', { username, message })
  })

  socket.on('gameEvent', (message) => {
    const username = GAME
    io.emit('message', { username, message })
  })
})

http.listen(4000, () => {
  console.log('Socket.io listening on port 4000'.green.bold)
})
