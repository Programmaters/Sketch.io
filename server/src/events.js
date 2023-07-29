import { Room } from './room.js'
import { getRandomId, getRoom, addRoom } from './utils.js'


/* Game Events */
function onCreateRoom(session, data) {
    const roomId = getRandomId()
    const room = new Room(roomId, session.io, session.socket)
    addRoom(room)
    room.join(session.socket, data.username)
    session.socket.emit('joinedRoom', { roomId, username: data.username })
}

function onJoinRoom(session, data) {
    const room = getRoom(session.socket, data.roomId)
    room.join(session.socket, data.username)
    session.socket.emit('joinedRoom', { roomId: session.roomId, username: data.username })
    session.socket.broadcast.to(data.roomId).emit('playerJoinedRoom', { roomId: data.roomId, username: data.username })
}

function onLeaveRoom(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.leave(session.socket, data.username)
    session.socket.broadcast.to(session.roomId).emit('playerLeftRoom', { roomId: session.roomId, username: data.username })
}

function onUpdateSettings(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.updateSettings(data.settings)
}

function onStartGame(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.newGame()
    room.game.startGame
}


/* Chat Events */
function onMessage(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.onMessage(data.username, data.message)
}


/* Draw Events */
function onDrawingAction(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.game.canvas.draw(data)

    const socket = session.socket
    delete session.socket
    socket.broadcast.emit('drawingAction', data)
}

function onClearCanvas(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.game.canvas.clear()
    session.socket.broadcast.emit('clearCanvas')
}

function onSave(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.game.canvas.save()
}

function onUndo(session, data) {
    const room = getRoom(session.socket, session.roomId)
    room.game.canvas.undo()
    const canvasData = room.game.canvas.getData()
    session.socket.broadcast.emit('canvasData', canvasData)
    session.socket.emit('canvasData', canvasData)
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
