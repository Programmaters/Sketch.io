const socket = io('ws://localhost:8080')

socket.on('canvasData', (data) => {
    clearCanvas()
    data.forEach(drawAction)
})

socket.on('clearCanvas', clearCanvas)

document.querySelector('#clear-button').onclick = () => {
    socket.emit('clearCanvas')
    clearCanvas()
}

document.querySelector('#undo-button').onclick = () => {
    socket.emit('undo')
}
