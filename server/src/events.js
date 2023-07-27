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
    room.game.startGame()
    data.socket.broadcast.emit('startGame', { word: room.game.word })
}

/* Chat Events */
function onMessage(data) {
    const room = getRoom(data.socket, data.roomId)
    room.onMessage(data.username, data.message)
}


/* Draw Events */
function onDrawingAction(data) {
    Room.find(socket.id).game.draw(socket.id, data)
    data.socket.broadcast.emit('drawingAction', data)
}

function onClearCanvas(data) {
    canvas.clear()
    data.socket.broadcast.emit('clearCanvas')
}

function onMouseReleased() {
    save()
}

function onUndo(data) {
    canvas.undo()
    const canvasData = getCanvasData()
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
    'mouseReleased': onMouseReleased,
    'undo': onUndo,
}
