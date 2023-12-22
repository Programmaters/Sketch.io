import { Room } from "../src/room.js"

import { createServer } from 'http'
import { Server } from 'socket.io'

import assert from 'assert'

let clientSocket
const http = createServer()
let io = new Server(http)

io.on("connection", (socket) => {
  clientSocket = socket
})

io.listen(8080, () => console.log('listening on http://localhost:8080'))

describe('Room', () => {
  const room = new Room('room1', io, clientSocket)

  it('Create and join a room', () => {
    
    clientSocket.on('createRoom', () => {
      assert.equal(room.players.length, 0)
      assert.equal(room.game, null);
    })

    clientSocket.emit('createRoom')
    
  })

  it('Create and join a room', () => {

    clientSocket.on('joinRoom', () => {
      room.join('player1')
      assert.equal(room.players.length, 1)
      assert.equal(room.game, null)
    })

    clientSocket.emit('joinRoom')
    
  })
})