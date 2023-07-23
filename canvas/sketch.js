let x, y, px, py = 0
let mouseInCanvas = false
let drawColor = 'black'
const eraseColor = 'white'
const drawWeight = 5
const eraseWeight = 10
const easing = 0.3
const canvasWidth = 800
const canvasHeight = 600


function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight)
    clearCanvas()
    socket.on('drawingAction', drawAction) // listen for drawing actions from the server
    canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault()) // disable right-click context menu on canvas

    document.addEventListener('mousemove', (e) => {
        // check if the mouse is within the canvas boundaries
        const canvasRect = canvas.elt.getBoundingClientRect()
        const drawCursor = document.querySelector('#draw-cursor')
        if (
            e.clientX >= canvasRect.left &&
            e.clientX <= canvasRect.right &&
            e.clientY >= canvasRect.top &&
            e.clientY <= canvasRect.bottom
        ) {
            mouseInCanvas = true
            drawCursor.style.display = 'block'
            document.body.style.cursor = 'none'
            drawCursor.style.top = `${e.clientY-5}px`
            drawCursor.style.left = `${e.clientX-5}px`
            
        } else {
            mouseInCanvas = false
            drawCursor.style.display = 'none'
            document.body.style.cursor = 'default'
        } 
    })
}


function mouseDragged() {
    
    
    // determine if it's a left-click (draw) or right-click (erase) action
    const drawColor = document.querySelector('#draw-cursor').style.backgroundColor
    const color = mouseButton === LEFT ? drawColor : eraseColor
    const weight = mouseButton === LEFT ? drawWeight : eraseWeight

    x += (mouseX- x) * easing
    y += (mouseY - y) * easing

    const data = { x, y, px, py, color, weight }
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
    strokeWeight(data.weight)
    line(data.x, data.y, data.px, data.py)
}

function clearCanvas() {
    background(255)
}
