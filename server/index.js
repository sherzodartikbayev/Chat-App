require('dotenv').config()

const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

const { Server } = require('socket.io')

const io = new Server(server, {
	cors: process.env.CLIENT_URL,
})

io.on('connection', socket => {
	console.log('Connection', socket.id)

	socket.on('send_message', message => {
		socket.broadcast.emit('receive_message', message)
	})

	socket.on('user_typing', data => {
		socket.broadcast.emit('user_typing', data)
	})

	socket.on('new_user', data => {
		socket.broadcast.emit('new_user', data)
	})
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
