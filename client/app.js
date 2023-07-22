const socket = io('ws://localhost:8080')

socket.on('message', text => {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
})

socket.on('canvasData', (data) => {
    data.forEach(drawAction)
})

socket.on('clearCanvas', () => {
    background(255)
})


document.querySelector('#send-button').onclick = () => {
    const input = document.querySelector('input')
    socket.emit('message', input.value)
    const button = document.getElementById("send-button")
    button.innerText = "Send"
    input.value = ""
}

document.querySelector('#clear-button').onclick = () => {
    socket.emit('clearCanvas')
    background(255)
}