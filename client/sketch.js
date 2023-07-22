let drawColor = 'black'
const eraseColor = 'white'
const drawWeight = 5
const eraseWeight = 10

var x = 0,
    y = 0,
    px = 0,
    py = 0,
    easing = 0.3;

function setup() {
    const canvas = createCanvas(800, 600)
    background(255) // set the background color to white
    socket.on('drawingAction', drawAction) // listen for drawing actions from the server
    canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault()) // disable right-click context menu on canvas
}


function mouseDragged() {

    // determine if it's a left-click (draw) or right-click (erase) action
    const selectElement = document.getElementById("color-select")
    const selectedColor = selectElement.options[selectElement.selectedIndex].value;

    const color = mouseButton === LEFT ? selectedColor : eraseColor
    const weight = mouseButton === LEFT ? drawWeight : eraseWeight
    const data = {
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      color,
      weight
    }
    socket.emit('drawingAction', data) // send drawing action to the server
    drawAction(data) // draw the action immediately on the client-side
}

function reset() {
    px = x
    py = y
}

// function to draw the received action on the canvas
function mousePressed() {
    // Assign current mouse position to variables.
    x = mouseX;
    y = mouseY;
    px = mouseX;
    py = mouseY; 
    // Prevent default functionality.
    return false;
}


function drawAction(data) {
    x += (data.x - x) * easing;
    y += (data.y - y) * easing;
    stroke(data.color) // set stroke color
    strokeWeight(data.weight);
    line(x, y, px, py);
    px = x;
    py = y; 
}

function receiveDraw(data) {
    stroke(data.color) // set stroke color
    strokeWeight(data.weight);
    line(data.x, data.y, data.px, data.py);
}
