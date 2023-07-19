import { createServer } from 'http'
import { Server } from 'socket.io'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
const users = {}

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('message', (message) => {
        
        console.log(users)
        
        if (!users[socket.id]) { // first message is the name of the user
            console.log(`new user: ${message}`)
            users[socket.id] = message
            return
        }
        // send message if user already known
        console.log(`${users[socket.id]}: ${message}`)
        io.emit('message', `${users[socket.id]}: ${message}`)
    })
})

io.listen(8080, () => console.log('listening on http://localhost:8080') )
