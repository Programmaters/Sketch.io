import { Room } from './room.js'
import { Game } from './game.js'
import { Canvas } from './canvas.js'
import {getRandomId, getRoom, addRoom, getPlayerRoom} from './utils.js'

function onReconnect(conn, data) {
    const roomData = getPlayerRoom(data.playerId, data.roomId)
    if (roomData) {
        const { room, player } = roomData
        player.socket = conn.socket
        conn.socket.emit('joinedRoom', { roomId: data.roomId, playerId: conn.socket.id, players: room.getPlayers() })
    } else {
        throw new Error('Could not join room')
    }
}

/* Game Events */
function onCreateRoom(conn, data) {
    const roomId = getRandomId()
    const canvas = new Canvas()
    const game = new Game(conn.io, conn.socket, roomId, canvas)
    const room = new Room(roomId, conn.io, conn.socket, game)
    const playerId = conn.socket.id
    addRoom(room)
    room.join(room.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId, playerId, players: [{ name: data.username, id: playerId }] })
}

function onJoinRoom(conn, data) {
    const room = getRoom(data.roomId)
    room.join(data.username)
    conn.socket.emit('joinedRoom', { roomId: data.roomId, playerId: conn.socket.id, players: room.getPlayers() })
    conn.socket.emit('updateSettings', room.settings )
    conn.socket.broadcast.to(data.roomId).emit('playerJoinedRoom', { name: data.username, id: conn.socket.id } )
}

function onLeaveRoom(conn) {
    const player = conn.room.players.find(player => player.id === conn.socket.id)
    conn.room.leave(conn.socket, player.id)
    conn.socket.broadcast.to(conn.roomId).emit('playerLeftRoom', { name: player.name, id: player.id })
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
    'leaveRoom': onLeaveRoom,
    'reconnect': onReconnect
    // 'disconnect': onLeaveRoom
}