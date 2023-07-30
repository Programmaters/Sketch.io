
function startGame(data) {
    const settings = readSettings()
    socket.emit('startGame', settings)
    renderCanvas()
    
   

}

function onTurnToDraw() {
    drawMode = 'draw'
}