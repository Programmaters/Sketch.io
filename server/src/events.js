import { Room } from './room.js'
import { Game } from './game.js'
import { Canvas } from './canvas.js'
import {getRandomId, getRoom, addRoom} from './utils.js'

/* Game Events */
function onCreateRoom(conn, data) {
    const roomId = getRandomId()
    const playerId = conn.socket.id
    const canvas = new Canvas()
    const game = new Game(conn.io, conn.socket, roomId, canvas)
    const room = new Room(roomId, conn.io, conn.socket, game)
    addRoom(room)
    room.join(room.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId, playerId, players: [{ name: data.username, id: playerId }] })
}

function onJoinRoom(conn, data) {
    const room = getRoom(conn.roomId)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId: room.id, playerId: conn.socket.id, players: room.getPlayers() })
    conn.socket.emit('updateSettings', room.settings )
    conn.socket.emit('canvasData', room.game.canvas.getData())
    conn.socket.broadcast.to(room.id).emit('playerJoinedRoom', { player: { name: data.username, id: conn.socket.id } } )
}

function onLeaveRoom(conn) {
    if (!conn.room) throw new Error('Leave: Room not found')
    const player = conn.room.players.find(player => player.id === conn.socket.id)
    conn.room.leave(conn.socket, player.id)
    conn.socket.broadcast.to(conn.roomId).emit('playerLeftRoom', { playerId : player.id })
}

function onUpdateSettings(conn, data) {
    conn.room.updateSettings(data)
}

function onStartGame(conn) {
    conn.room.newGame()
}

function onSkipTurn(conn) {
    conn.room.game.endTurn()
}

function onHint(conn) {
    if (conn.room.game.hintCounter >= conn.room.settings.hints) return
    conn.room.game.hintCounter++
    conn.room.game.sendHint()
}

/* Chat Events */
function onMessage(conn, data) {
    conn.room.onMessage(conn.socket.id, data.message)
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
    'updateSettings': onUpdateSettings,
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