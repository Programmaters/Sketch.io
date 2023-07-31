
function receiveMessage(text, color) {
    const el = document.createElement('li')
    el.innerHTML = text
    if (color) el.style.color = color
    document.querySelector('#chat').appendChild(el)
}

function sendMessage() {
    if (drawer) return
    const input = document.querySelector('#message')
    socket.emit('message', { message: input.value, username })
    input.value = ""
}
