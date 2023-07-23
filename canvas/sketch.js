const easing = 0.3
const canvasWidth = 800
const canvasHeight = 600

let x, y, px, py = 0
let mouseInCanvas = false
let brushSize = 5
let brushColor = 'black'

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight)
    clearCanvas()
    socket.on('drawingAction', drawAction) // listen for drawing actions from the server
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    handleMouseMove(canvas)
}

function handleMouseMove(canvas) {
    const drawCursor = document.querySelector('#draw-cursor')

    const handleMouseIn = (e) => {
        mouseInCanvas = true
        drawCursor.style.display = 'block'
        document.body.style.cursor = 'none'
        drawCursor.style.top = `${e.clientY - 5}px`
        drawCursor.style.left = `${e.clientX - 5}px`
    }

    const handleMouseOut = () => {
        mouseInCanvas = false
        drawCursor.style.display = 'none'
        document.body.style.cursor = 'default'
    }

    document.addEventListener('mousemove', (e) => {
        const { left, right, top, bottom } = canvas.elt.getBoundingClientRect()
        if (e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom) {
            handleMouseIn(e)
        } else {
            handleMouseOut()
        }
    })
}

function mouseDragged() {
    x += (mouseX- x) * easing
    y += (mouseY - y) * easing
    const data = { x, y, px, py, color: brushColor, size: brushSize }
    socket.emit('drawingAction', data) // send drawing action to the server
    drawAction(data) // draw the action immediately on the client-side
    px = x
    py = y
}

function mousePressed() {
    x = mouseX
    px = mouseX
    y = mouseY
    py = mouseY
}

function mouseReleased() {
    if (mouseInCanvas) {
        socket.emit('mouseReleased')
    }
}

async function drawAction(data) {
    stroke(data.color)
    strokeWeight(data.size)
    line(data.x, data.y, data.px, data.py)
}

function clearCanvas() {
    background(255)
}

function setBrushColor(targetColor) {
    brushColor = targetColor
    document.querySelector('#draw-cursor').style.backgroundColor = targetColor
}

function setBrushSize(targetSize) {
    brushSize = targetSize
}
