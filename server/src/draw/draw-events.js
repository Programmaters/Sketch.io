
export function onDrawingAction(socket, data) {
    canvasData.push(data)
    socket.broadcast.emit('drawingAction', data)
}

export function onClearCanvas(socket) {
    canvasData = []
    socket.broadcast.emit('clearCanvas')
    canvasTimeline.push([...canvasData])
}

export function onMouseReleased(socket) {
    if(prevCanvasData) canvasTimeline.push(prevCanvasData)
    prevCanvasData = [...canvasData]
    if(canvasTimeline.length > maxUndos) canvasTimeline.shift()
}

export function onUndo(socket) {
    canvasData = canvasTimeline.length != 0 ? [...canvasTimeline.pop()] : canvasData
    prevCanvasData = [...canvasData]
    socket.broadcast.emit('canvasData', canvasData)
    socket.emit('canvasData', canvasData)
}


