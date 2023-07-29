import { createServer } from 'http'
import { Server } from 'socket.io'
import events from './events.js'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
export const rooms = {}

io.on('connection', (socket) => {
    Object.entries(events).forEach(([name, handler]) => {
        socket.on(name, (data) => {
            data = data || {}
            data.io = io
            data.socket = socket
            data.roomId = data.roomId || Array.from(socket.rooms).find(roomId => roomId !== socket.id)
            try {
                handler(data)
            } catch (error) {
                console.error(error)
            }
        })
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080'))
