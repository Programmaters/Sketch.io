import { Room } from './room.js'
import { Game } from './game.js'
import { Canvas } from './canvas.js'
import {getRandomId, getRoom, addRoom, hideWord} from './utils.js'
import {rooms} from "./main.js";

/* Game Events */
function onCreateRoom(conn, data) {
    const roomId = getRandomId()
    const playerId = conn.socket.id
    const canvas = new Canvas()
    const game = new Game(conn.io, conn.socket, roomId, canvas)
    const room = new Room(roomId, conn.io, conn.socket, game)
    addRoom(room)
    room.join(room.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId, playerId, players: [{ name: data.username, id: playerId }], config: room.gameConfig  })
}

function onJoinRoom(conn, data) {
    const room = getRoom(conn.roomId)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId: room.id, playerId: conn.socket.id, players: room.getPlayers(), config: room.gameConfig, host: room.socket.id })
    conn.socket.emit('canvasData', room.game.canvas.getData())
    conn.socket.broadcast.to(room.id).emit('playerJoinedRoom', { player: { name: data.username, id: conn.socket.id } } )
    if (room.game.running) {
        conn.socket.emit('gameStarted')
        conn.socket.emit('guessTurn', { word: hideWord(room.game.currentWord), round: room.game.round, drawer: room.game.drawer.id })
        conn.socket.emit('canvasData', room.game.canvas.getData())
    }
}

function onLeaveRoom(conn) {
    if (!conn.room) throw new Error('Leave: Room not found')
    const player = conn.room.players.find(player => player.id === conn.socket.id)
    conn.room.leave(conn.socket, player.id)
    conn.socket.broadcast.to(conn.roomId).emit('playerLeftRoom', { playerId : player.id })
    if (conn.room.players.length === 0) { // delete room when no players left
        delete rooms[conn.roomId]
        return
    }
    if (conn.room.game.drawer.id === player.id) { // skip turn when drawer leaves
        conn.room.game.endTurn()
    }
    if (conn.room.socket.id === player.id) { // select new host when host leaves
        conn.room.socket = conn.room.players[0].socket
    }
}

function onUpdateGameConfig(conn, data) {
    conn.room.updateGameConfig(data.gameConfig)
    conn.socket.broadcast.to(conn.roomId).emit('updateGameConfig', data)
}

function onStartGame(conn) {
    if (conn.room.game.running) throw new Error('Game already running')
    if (conn.room.players.length < 2) throw new Error('Not enough players')
    conn.room.newGame()
}

function onSkipTurn(conn) {
    conn.room.game.endTurn()
}

function onHint(conn) {
    if (conn.room.game.hintCounter >= conn.room.gameConfig.hints) return
    conn.room.game.hintCounter++
    conn.room.game.sendHint()
}

/* Chat Events */
function onMessage(conn, data) {
    const player = conn.room.players.find(player => player.id === conn.socket.id)
    const sendMessageToRoom = conn.room.onMessage(player, data.message)
    if (sendMessageToRoom) {
        conn.socket.broadcast.to(conn.roomId).emit('message', { text: data.message, sender: player.name })
    }
}

/* Draw Events */
function onDrawingAction(conn, data) {
    conn.room.game.canvas.draw(data)
    conn.socket.broadcast.to(conn.roomId).emit('drawingAction', data)
}

function onClearCanvas(conn) {
    conn.room.game.canvas.clear()
    conn.socket.broadcast.to(conn.roomId).emit('clearCanvas')
}

function onSave(conn) {
    conn.room.game.canvas.save()
}

function onUndo(conn) {
    conn.room.game.canvas.undo()
    const canvasData = conn.room.game.canvas.getData()
    conn.socket.emit('canvasData', canvasData)
    conn.socket.broadcast.to(conn.roomId).emit('canvasData', canvasData)
}

export default {
    'createRoom': onCreateRoom,
    'joinRoom': onJoinRoom,
    'updateGameConfig': onUpdateGameConfig,
    'startGame': onStartGame,
    'message': onMessage,
    'skipTurn': onSkipTurn,
    'hint': onHint,
    'drawingAction': onDrawingAction,
    'clearCanvas': onClearCanvas,
    'mouseReleased': onSave,
    'undo': onUndo,
    'disconnecting': onLeaveRoom
}