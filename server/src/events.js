import { Room } from './room.js'
import { getRandomId, getRoom, addRoom } from './utils.js'


/* Game Events */
function onCreateRoom(data) {
    const roomId = getRandomId()
    const room = new Room(roomId, data.io, data.socket)
    addRoom(room)
    room.join(data.socket, data.username)
    data.socket.emit('joinedRoom', { roomId, username: data.username })
}

function onJoinRoom(data) {
    const room = getRoom(data.socket, data.roomId)
    room.join(data.socket, data.username)
    data.socket.emit('joinedRoom', { roomId: data.roomId, username: data.username })
    data.socket.broadcast.to(data.roomId).emit('playerJoinedRoom', { roomId: data.roomId, username: data.username })
}

function onLeaveRoom(data) {
    const room = getRoom(data.socket, data.roomId)
    room.leave(data.socket, data.username)
    data.socket.broadcast.to(data.roomId).emit('playerLeftRoom', { roomId: data.roomId, username: data.username })
}

function onUpdateSettings(data) {
    const room = getRoom(data.socket, data.roomId)
    room.updateSettings(data.settings)
}

function onStartGame(data) {
    const room = getRoom(data.socket, data.roomId)
    room.newGame()
    room.game.startGame
}


/* Chat Events */
function onMessage(data) {
    const room = getRoom(data.socket, data.roomId)
    room.onMessage(data.username, data.message)
}


/* Draw Events */
function onDrawingAction(data) {
    const room = getRoom(data.socket, data.roomId)
    room.game.canvas.draw(data)
    data.socket.broadcast.emit('drawingAction', data) // maximum call stack size exceeded
}

function onClearCanvas(data) {
    const room = getRoom(data.socket, data.roomId)
    room.game.canvas.clear()
    data.socket.broadcast.emit('clearCanvas')
}

function onSave() {
    const room = getRoom(data.socket, data.roomId)
    room.game.canvas.save()
}

function onUndo(data) {
    const room = getRoom(data.socket, data.roomId)
    room.game.canvas.undo()
    const canvasData = room.game.canvas.getData()
    data.socket.broadcast.emit('canvasData', canvasData)
    data.socket.emit('canvasData', canvasData)
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
