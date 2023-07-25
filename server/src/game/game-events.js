
export function onNewLobby(socket) {
    lobby = new Lobby(socket)
}

export function onStartGame(socket) {
    lobby.newGame()
    socket.broadcast.emit('startGame', { word: lobby.game.word})
}

