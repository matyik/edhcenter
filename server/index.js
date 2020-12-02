const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const formatMessage = require('./utils/messages')

const GAME = 'Game'

io.on('connection', socket => {
  socket.on('message', ({ username, message }) => {
    io.emit('message', { username, message })
  })

  socket.on('gameEvent', message => {
    const username = GAME
    io.emit('message', { username, message })
  })
})

http.listen(4000, () => {
  console.log('listening on port 4000')
})