import { createServer } from 'http'
import { Server } from 'socket.io'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
const users = {}
let canvasData = []
let canvasTimeline = []
let prevCanvasData = []
let settings = {}

io.on('connection', (socket) => {
    socket.emit('canvasData', canvasData)

    socket.on('message', (message) => {
        if (!users[socket.id]) {
            users[socket.id] = message
            
            if (users.length > settings.maxPlayers) {
                socket.disconnect()
            }
            return
        }
        io.emit('message', `${users[socket.id]}: ${message}`)
    })

    socket.on('drawingAction', (data) => {
        canvasData.push(data)
        socket.broadcast.emit('drawingAction', data)
    })

    socket.on('clearCanvas', () => {
        canvasData = []
        socket.broadcast.emit('clearCanvas')
        canvasTimeline.push([...canvasData])
    })

    socket.on('mouseReleased', () => {
        if(prevCanvasData) canvasTimeline.push(prevCanvasData)
        prevCanvasData = [...canvasData]
    })

    socket.on('undo', () => {
        canvasData = canvasTimeline.length != 0 ? [...canvasTimeline.pop()] : []
        prevCanvasData = [...canvasData]
        socket.broadcast.emit('canvasData', canvasData)
        socket.emit('canvasData', canvasData)
    })

    socket.on('onUpdateSettings', (newSettings) => {
        settings = newSettings
        console.log(settings)
    })

    socket.on('start', () => {
        console.log("RICARDO É GAY")
        // call game logic function with settings
    })

})
io.listen(8080, () => console.log('listening on http://localhost:8080') )
