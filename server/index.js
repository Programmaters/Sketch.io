import { createServer } from 'http'
import { Server } from 'socket.io'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
const users = {}
const canvasData = []

io.on('connection', (socket) => {
    socket.emit('canvasData', canvasData)

    socket.on('message', (message) => {
        if (!users[socket.id]) { // first message is the name of the user
            users[socket.id] = message
            return
        }
        // send message if user already known
        io.emit('message', `${users[socket.id]}: ${message}`)
    })

    socket.on('drawingAction', (data) => {
        canvasData.push(data)
        socket.broadcast.emit('drawingAction', data)
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080') )
