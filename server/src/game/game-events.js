
export function onNewLobby(socket) {
    lobby = new Lobby(socket.id)
}

export function onStartGame(socket) {
    lobby.newGame()
    socket.broadcast.emit('startGame', { word: lobby.game.word})
}

