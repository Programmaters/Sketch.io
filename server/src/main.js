import { createServer } from 'http'
import { Server } from 'socket.io'
import events from './events.js'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
const port = 8080

export const rooms = {}

io.on('connection', (socket) => {
    Object.entries(events).forEach(([event, handler]) => {
        socket.on(event, (data) => {
            const roomId = data?.roomId || Array.from(socket.rooms).find(roomId => roomId !== socket.id)
            const room = rooms[roomId]
            const conn = { io, socket, room, roomId }
            console.log(event)
            try {
                handler(conn, data)
            } catch (e) {
                socket.emit('error', e.message)
                console.error(e)
            }
        })
    })
})

io.listen(port)
console.log(`Server listening on port ${port}`)