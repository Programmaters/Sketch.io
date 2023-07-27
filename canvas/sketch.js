let x, y, px, py = 0
let mouseInCanvas = false
let brushSize = 5
let brushColor = 'black'
let drawMode = 'draw' // draw, erase, picker, fill
const easing = 0.3
const width = 800
const height = 600

/**
 * Function called when the page is loaded
 * Setup the canvas
 */
function setup() {
    const canvas = createCanvas(width, height)
    pixelDensity(1)
    clearCanvas()
    socket.on('drawingAction', (data) => {
        switch (data.mode) {
            case 'brush':
                drawLine(data)
                break
            case 'fill':
                floodFill(data)
                break
        }
    }) 
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    handleMouseMove(canvas)
}

/**
 * Function to handle the mouse move event
 * @param {Canvas} canvas 
 */
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

/**
 * Function called when the mouse is dragged
 * Draw and emit the drawing action to the server
 */
function mouseDragged() {
    if (!mouseInCanvas || (!['draw', 'erase'].includes(drawMode))) return
    x += (mouseX- x) * easing
    y += (mouseY - y) * easing
    drawAction()
    px = x
    py = y
}

/**
 * Function called when the mouse is pressed
 * Update coordinate positions
 * Draw and emit the drawing action to the server
 */
function mousePressed() {
    x = mouseX
    px = mouseX
    y = mouseY
    py = mouseY

    switch (drawMode) {
        case 'draw':
            drawAction()
            break
        case 'erase':
            setBrushColor('white')
            drawAction()
            break
        case 'picker':
            const pickerColor = `rgba(${get(x, y)})`
            setBrushColor(pickerColor)
            setDrawMode('draw')
            break
        case 'fill':
            const fillColor = color(brushColor).levels
            const targetColor = [fillColor[0], fillColor[1], fillColor[2], 255]
            const data = { mode: 'fill', x: parseInt(mouseX), y: parseInt(mouseY), color: targetColor }
            socket.emit('drawingAction', data)
            floodFill(data)
            break
    }
}

/**
 * Function called when the mouse is released
 * Emit the mouseReleased event to the server
 */
function mouseReleased() {
    if (mouseInCanvas) {
        socket.emit('mouseReleased')
    }
}

/**
 * Draw a line in the canvas and emit the drawing action to the server
 */
function drawAction() {
    const data = { mode: 'brush', x, y, px, py, color: brushColor, size: brushSize }
    socket.emit('drawingAction', data)
    drawLine(data)
}

/**
 * Draw a line in the canvas
 * @param {Object} data - line data
 */
function drawLine(data) {
    stroke(data.color)
    strokeWeight(data.size)
    line(data.x, data.y, data.px, data.py)
}

/**
 * Clear the canvas
 */
function clearCanvas() {
    background(255)
}

/**
 * Set the brush color
 * @param {String} targetColor 
 */
function setBrushColor(targetColor) {
    brushColor = targetColor
    document.querySelector('#draw-cursor').style.backgroundColor = targetColor
}

/**
 * Set the brush size
 * @param {Integer} targetSize 
 */
function setBrushSize(targetSize) {
    brushSize = targetSize
}

/**
 * Set the draw mode
 */
function setDrawMode(targetMode) {
    drawMode = targetMode
}

/**
 * Saves the canvas as a png file 
 */
function saveDraw() {
    saveCanvas('myCanvas', 'png')
}

const data = [
    {
        mode: "brush",
        x: 0,
        y: 0,
        px: 0,
        color: "black",
        size: 5
    },
    {
        mode: "fill",
        x: 0,
        y: 0,
        color: "red"
    }
]