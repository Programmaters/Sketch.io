

export function onDrawingAction(socket, data) {
    Lobby.find(socket.id).game.draw(socket.id, data)
    socket.broadcast.emit('drawingAction', data)
}

export function onClearCanvas(socket) {
    canvas.clear()
    socket.broadcast.emit('clearCanvas')
}

export function onMouseReleased() {
    save()
}

export function onUndo(socket) {
    canvas.undo()
    const data = getCanvasData()
    socket.broadcast.emit('canvasData', data)
    socket.emit('canvasData', data)
}


