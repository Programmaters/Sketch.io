let username = null
let host = false

function receiveMessage(text) {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
}

function sendMessage() {
    const input = document.querySelector('#message')
    socket.emit('message', { message: input.value, username })
    input.value = ""
}