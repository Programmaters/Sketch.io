// game events
function onNewLobby(socket) {
    lobby = new Lobby(socket)
}

function onStartGame(socket) {
    lobby.newGame()
    socket.broadcast.emit('startGame', { word: lobby.game.word})
}


// chat events
function onMessage(socket, message) {

    /** TODO:
     * If player is drawing, send message to room for players who have already guessed
     * If player is guessing, send message to room for players who are drawing:
     *    - if message has a max difference of 2 characters from the word, check if its correct, and if not if its close and tell user -> do not broadcast message
     *    - else broadcast message
     *  
     * If the player guessed, send message to room for players who have already guessed
    */

    socket.broadcast.emit('message', `${socket.id}: ${message}`)
}


// draw events
function onDrawingAction(socket, data) {
    Lobby.find(socket.id).game.draw(socket.id, data)
    socket.broadcast.emit('drawingAction', data)
}

function onClearCanvas(socket) {
    canvas.clear()
    socket.broadcast.emit('clearCanvas')
}

function onMouseReleased() {
    save()
}

function onUndo(socket) {
    canvas.undo()
    const data = getCanvasData()
    socket.broadcast.emit('canvasData', data)
    socket.emit('canvasData', data)
}


export default {
    'drawingAction': onDrawingAction,
    'clearCanvas': onClearCanvas,
    'mouseReleased': onMouseReleased,
    'undo': onUndo,
    'message': onMessage,
    'newLobby': onNewLobby,
    'startGame': onStartGame,
}
