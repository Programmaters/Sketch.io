
export function onMessage(socket, message) {
    socket.broadcast.emit('message', `${socket.id}: ${message}`)
}

