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


document.addEventListener('DOMContentLoaded', () => {
    const colorPalette = document.querySelector('#color-palette')
    const colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'brown', 'pink', 'white']
    colors.forEach(color => {
        const option = document.createElement('div')
        option.classList.add('color-option')
        option.style.backgroundColor = color
        option.onclick = () => {
            document.querySelector('#draw-cursor').style.backgroundColor = color
        }
        colorPalette.appendChild(option)
    })
    const drawCursor = document.querySelector('#draw-cursor')
    drawCursor.style.backgroundColor = 'black'
})

document.querySelector('#bucket-button').onclick = () => {
    socket.emit('bucket')
}

document.querySelector('#brush-size').addEventListener('change', (e) => setBrushSize(e.target.value))
