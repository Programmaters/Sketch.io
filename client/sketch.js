let x, y, px, py = 0
let drawColor = 'black'
const eraseColor = 'white'
const drawWeight = 5
const eraseWeight = 10
const easing = 0.3
const canvasWidth = 800
const canvasHeight = 600


function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight)
    background(255) // set the background color to white
    socket.on('drawingAction', drawAction) // listen for drawing actions from the server
    canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault()) // disable right-click context menu on canvas
}


function mouseDragged() {
    const selectElement = document.getElementById("color-select")
    const selectedColor = selectElement.options[selectElement.selectedIndex].value
    
    // determine if it's a left-click (draw) or right-click (erase) action
    const color = mouseButton === LEFT ? selectedColor : eraseColor
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

function drawAction(data) {
    stroke(data.color)
    strokeWeight(data.weight)
    line(data.x, data.y, data.px, data.py)
}
