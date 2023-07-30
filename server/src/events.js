import { Room } from './room.js'
import { getRandomId, getRoom, addRoom } from './utils.js'


/* Game Events */
function onCreateRoom(conn, data) {
    const roomId = getRandomId()
    const room = new Room(roomId, conn.io, conn.socket)
    addRoom(room)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId, username: data.username })
}

function onJoinRoom(conn, data) {
    const room = getRoom(conn.socket, data.roomId)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId: conn.roomId, username: data.username })
    conn.socket.broadcast.to(data.roomId).emit('playerJoinedRoom', { roomId: data.roomId, username: data.username })
}

function onLeaveRoom(conn, data) {
    const room = getRoom(conn.socket, conn.roomId)
    room.leave(conn.socket, data.username)
    conn.socket.broadcast.to(conn.roomId).emit('playerLeftRoom', { roomId: conn.roomId, username: data.username })
}

function onUpdateSettings(conn, data) {
    const room = getRoom(conn.socket, conn.roomId)
    room.updateSettings(data.settings)
}

function onStartGame(conn, data) {
    const room = getRoom(conn.socket, conn.roomId)
    room.newGame()
    room.game.startGame
}


/* Chat Events */
function onMessage(conn, data) {
    const room = getRoom(conn.socket, conn.roomId)
    room.onMessage(data.username, data.message)
}


/* Draw Events */
function onDrawingAction(conn, data) {
    const room = getRoom(conn.socket, conn.roomId)
    room.game.canvas.draw(data)
    conn.socket.broadcast.to(conn.roomId).emit('drawingAction', data)
}

function onClearCanvas(conn) {
    const room = getRoom(conn.socket, conn.roomId)
    room.game.canvas.clear()
    conn.socket.broadcast.to(conn.roomId).emit('clearCanvas')
}

function onSave(conn) {
    const room = getRoom(conn.socket, conn.roomId)
    room.game.canvas.save()
}

function onUndo(conn) {
    const room = getRoom(conn.socket, conn.roomId)
    room.game.canvas.undo()
    const canvasData = room.game.canvas.getData()
    conn.socket.emit('canvasData', canvasData)
    conn.socket.broadcast.to(conn.roomId).emit('canvasData', canvasData)
}


export default {
    'createRoom': onCreateRoom,
    'joinRoom': onJoinRoom,
    'leaveRoom': onLeaveRoom,
    'updateSettings': onUpdateSettings,
    'startGame': onStartGame,
    'message': onMessage,
    'drawingAction': onDrawingAction,
    'clearCanvas': onClearCanvas,
    'mouseReleased': onSave,
    'undo': onUndo,
}
