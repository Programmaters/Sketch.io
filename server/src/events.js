import { randomUUID } from 'crypto'
import { Room } from './room.js'
import { getRoom } from './utils.js'

// game events
function onCreateRoom(data) {
    const roomId = randomUUID()
    const room = new Room(roomId, data.io, data.socket)
    room.join(data.socket, data.name)
    rooms[roomId] = room
}

function onJoinRoom(data) {
    const room = getRoom(data.socket, data.roomId)
    room.join(data.socket, data.name)
}

function onLeaveRoom(data) {
    const room = getRoom(data.socket, data.roomId)
    room.leave(data.playerId)
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


// chat events
function onMessage(data) {
    const room = getRoom(data.socket, data.roomId)
    room.message(data.playerId, data.message)
}


// draw events
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
