import { createServer } from 'http'
import { Server } from 'socket.io'
import events from './events.js'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })

const withSocket = (handler) => (socket, ...args) => handler(socket, ...args)

io.on('connection', (socket) => {
    Object.entries(events).forEach(([name, handler]) => {
        socket.on(name, (data) => withSocket(handler)(socket, data))
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080'))
