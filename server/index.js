import { createServer } from 'http'
import { Server } from 'socket.io'

const http = createServer()
const io = new Server(http, { cors: { origin: "*" } })
const users = {}
const maxUndos = 10
let canvasData = []
let canvasTimeline = []
let prevCanvasData = []

io.on('connection', (socket) => {
    socket.emit('canvasData', canvasData)

    socket.on('message', (message) => {
        if (!users[socket.id]) {
            users[socket.id] = message
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
        if(canvasTimeline.length > maxUndos) canvasTimeline.shift()
    })

    socket.on('undo', () => {
        canvasData = canvasTimeline.length != 0 ? [...canvasTimeline.pop()] : canvasData
        prevCanvasData = [...canvasData]
        socket.broadcast.emit('canvasData', canvasData)
        socket.emit('canvasData', canvasData)
    })


})

io.listen(8080, () => console.log('listening on http://localhost:8080') )