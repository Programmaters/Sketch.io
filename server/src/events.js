import { Room } from './room.js'
import { getRandomId, getRoom, addRoom } from './utils.js'


/* Game Events */
function onCreateRoom(conn, data) {
    const roomId = getRandomId()
    const room = new Room(roomId, conn.io, conn.socket)
    addRoom(room)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId, player: {username: data.username, id: conn.socket.id} })
}

function onJoinRoom(conn, data) {
    const room = getRoom(data.roomId)
    room.join(conn.socket, data.username)
    conn.socket.emit('joinedRoom', { roomId: data.roomId, players: room.players.map(player => ({username: player.name, id: player.id})) })
    conn.socket.broadcast.to(data.roomId).emit('playerJoinedRoom', {username: data.username, id: conn.socket.id} )
}

function onLeaveRoom(conn) {
    const player = conn.room.players.find(player => player.id == conn.socket.id)
    conn.room.leave(conn.socket, player.name)
    conn.socket.broadcast.to(conn.roomId).emit('playerLeftRoom', {username: player.name, id: player.id})
}

function onUpdateSettings(conn, data) {
    conn.room.updateSettings(data.settings)
}

function onStartGame(conn, data) {
    conn.room.newGame()
    conn.room.game.startGame(data)
}

function onSkipTurn(conn) {
    conn.room.game.endTurn()
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
    'leaveRoom': onLeaveRoom,
    // 'disconnect': onLeaveRoom,
    'updateSettings': onUpdateSettings,
    'startGame': onStartGame,
    'message': onMessage,
    'skipTurn': onSkipTurn,
    'drawingAction': onDrawingAction,
    'clearCanvas': onClearCanvas,
    'mouseReleased': onSave,
    'undo': onUndo,
}
