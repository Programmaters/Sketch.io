import { createServer } from 'http'
import { Server } from 'socket.io'
import events from './events.js'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
export const rooms = {}

io.on('connection', (socket) => {
    Object.entries(events).forEach(([name, handler]) => {
        socket.on(name, (data) => {
            const roomId = Array.from(socket.rooms).find(roomId => roomId !== socket.id) // check later
            const room = rooms[roomId]
            const conn = { io, socket, roomId, room }
            try {
                handler(conn, data)
            } catch (e) {
                socket.emit('error', e)
                console.error(e)
            }
        })
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080'))