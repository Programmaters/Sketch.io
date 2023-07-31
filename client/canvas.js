const easing = 0.3
const width = 500
const height = 350
let x, y, px, py = 0
let mouseInCanvas = false
let brushSize = 5
let brushColor = 'black'
let drawMode = null // draw, erase, picker, fill

function setup() {
    noCanvas()
}

function renderDrawTools() {

    const drawCursor = document.createElement('div')
    drawCursor.id = 'draw-cursor'

    const eraseButton = document.createElement('button')
    eraseButton.id = 'erase-button'
    eraseButton.textContent = 'Erase'
    eraseButton.onclick = () => { setDrawMode('erase') }

    const clearButton = document.createElement('button')
    clearButton.id = 'clear-button'
    clearButton.textContent = 'Clear'
    clearButton.onclick = () => {
        socket.emit('clearCanvas')
        clearCanvas()
    }

    const undoButton = document.createElement('button')
    undoButton.id = 'undo-button'
    undoButton.textContent = 'Undo'
    undoButton.onclick = () => { socket.emit('undo') }

    const colorPickerButton = document.createElement('button')
    colorPickerButton.id = 'color-picker-button'
    colorPickerButton.textContent = 'Color Picker'
    colorPickerButton.onclick = () => { setDrawMode('picker') }

    const fillButton = document.createElement('button')
    fillButton.id = 'fill-button'
    fillButton.textContent = 'Fill'
    fillButton.onclick = () => { setDrawMode('fill') }

    const saveButton = document.createElement('button')
    saveButton.id = 'save-button'
    saveButton.textContent = 'Save'
    saveButton.onclick = saveDraw

    
    const brushSizeInput = document.createElement('input')
    brushSizeInput.id = 'brush-size'
    brushSizeInput.type = 'range'
    brushSizeInput.min = 1
    brushSizeInput.max = 100
    
    
    const colorPalette = document.createElement('div')
    colorPalette.id = 'color-palette'
    
    const colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'brown', 'pink', 'white']
    colors.forEach(color => {
        const option = document.createElement('div')
        option.classList.add('color-option')
        option.style.backgroundColor = color
        option.onclick = () => { 
            setDrawMode('draw')
            setBrushColor(color)
        }
        colorPalette.appendChild(option)
    })
    drawCursor.style.backgroundColor = 'black'

    const toolsDiv = document.querySelector('#draw-tools')

    toolsDiv.replaceChildren(drawCursor, eraseButton, clearButton, undoButton, colorPickerButton, fillButton, saveButton, brushSizeInput, colorPalette)
}

function removeDrawTools() {
    const toolsDiv = document.querySelector('#draw-tools')
    toolsDiv.replaceChildren()
}

/**
 * Function called when the page is loaded
 * Setup the canvas
 */
function renderCanvas() {
    const leftDiv = document.querySelector('#left-div')
    const canvasContainer = document.createElement('div')
    canvasContainer.id = 'canvas-container'

    const drawTools = document.createElement('div')
    drawTools.id = 'draw-tools'

    const timer = document.createElement('div')
    timer.id = 'timer'

    canvasContainer.appendChild(drawTools)
    canvasContainer.appendChild(timer)
    leftDiv.replaceChildren(canvasContainer)

    const canvas = createCanvas(width, height)
    canvas.style('visibility', 'visible')
    canvas.parent('canvas-container')
    
    pixelDensity(1)
    clearCanvas()

    document.addEventListener('contextmenu', (e) => e.preventDefault())
    handleMouseMove(canvas)
}

function onDrawingAction(data) {
    switch (data.mode) {
        case 'brush':
            drawLine(data)
            break
        case 'fill':
            floodFill(data)
            break
    }
}

function onCanvasData(data) {
    clearCanvas()
    data.forEach(drawLine)
}

/**
 * Function to handle the mouse move event
 * @param {Canvas} canvas 
 */
function handleMouseMove(canvas) {
   
    const handleMouseIn = (e) => {
        mouseInCanvas = true
        if (!drawMode) return
        const drawCursor = document.querySelector('#draw-cursor')
        document.body.style.cursor = 'none'
        drawCursor.style.display = 'block'
        drawCursor.style.top = `${e.clientY - 5}px`
        drawCursor.style.left = `${e.clientX - 5}px`
    }

    const handleMouseOut = () => {
        mouseInCanvas = false
        if (!drawMode) return
        const drawCursor = document.querySelector('#draw-cursor')
        document.body.style.cursor = 'default'
        drawCursor.style.display = 'none'
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
    if(!drawMode) return
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
    if (!drawMode) return
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
    if(!drawMode) return
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