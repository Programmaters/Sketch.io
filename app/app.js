const socket = io('ws://localhost:8080')

socket.on('message', text => {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
})

document.querySelector('button').onclick = () => {
    const input = document.querySelector('input')
    socket.emit('message', input.value)
    const button = document.getElementById("send-button")
    button.innerText = "Send"
    input.value = ""
}
