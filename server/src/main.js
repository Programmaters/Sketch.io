import { createServer } from 'http'
import { Server } from 'socket.io'
import events from './events.js'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })

export const rooms = {}

io.on('connection', (socket) => {
    Object.entries(events).forEach(([name, handler]) => {
        socket.on(name, (data) => {
            data.io = io
            data.socket = socket
            try {
                handler(data)
            } catch (error) {
                console.error(error)
            }
        })
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080'))

// q: whats the difference between socket and io ?
// a: socket is a single connection, io is the server

/*

const rooms = {
    id: {
        host: socket.id,
        players: [],
        settings: defaultSettings,
        game: new Game(),
    }
}


*/