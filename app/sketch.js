var drawColor = 0
const eraseColor = 255
const drawWeight = 5
const eraseWeight = 10

function setup() {
    const canvas = createCanvas(800, 600)
    background(255) // set the background color to white
    socket.on('drawingAction', drawAction) // listen for drawing actions from the server
    canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault()) // disable right-click context menu on canvas
}


function mouseDragged() {

    // determine if it's a left-click (draw) or right-click (erase) action
    const color = mouseButton === LEFT ? drawColor : eraseColor
    const weight = mouseButton === LEFT ? drawWeight : eraseWeight
    const data = {
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      color: color,
      weight: weight
    }
    socket.emit('drawingAction', data) // send drawing action to the server
    drawAction(data) // draw the action immediately on the client-side
}
  
// function to draw the received action on the canvas
function drawAction(data) {
    stroke(data.color) // set stroke color
    strokeWeight(data.weight) // set stroke weight
    line(data.px, data.py, data.x, data.y) // draw a line between the previous and current mouse positions
}
  