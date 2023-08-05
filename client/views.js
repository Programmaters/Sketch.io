function renderHomepage() {

	const usernameInput = document.createElement('input')
	usernameInput.id = 'username'
	usernameInput.placeholder = 'username'

	const createRoomButton = document.createElement('button')
	createRoomButton.id = 'create-room'
	createRoomButton.textContent = 'Create Room'

	const joinRoomDiv = document.createElement('div')
	const roomIdInput = document.createElement('input')
	roomIdInput.id = 'join-room-id'
	roomIdInput.placeholder = 'room id'

	const joinRoomButton = document.createElement('button')
	joinRoomButton.id = 'join-room'
	joinRoomButton.textContent = 'Join Room'
	joinRoomDiv.appendChild(roomIdInput)
	joinRoomDiv.appendChild(joinRoomButton)

	document.getElementById('main-content').replaceChildren(usernameInput, createRoomButton, joinRoomDiv)

	document.querySelector('#create-room').onclick = () => {
		username = document.querySelector('#username').value
		socket.emit('createRoom', { username })
		host = true
	}
	
	document.querySelector('#join-room').onclick = () => {
		const roomId = document.querySelector('#join-room-id').value
		username = document.querySelector('#username').value
		socket.emit('joinRoom', { roomId, username })
		host = false
	}
}

function renderRoom(data) {
    const h2 = document.createElement('h2')
	h2.innerText = `Room ${data.roomId}`
	const div = document.createElement('div')
	const input = document.createElement('input')
	input.id = 'message'
	input.placeholder = 'message'
	const sendButton = document.createElement('button')
	sendButton.id = 'send-button'
	sendButton.innerText = 'Send'
	sendButton.onclick = sendMessage

	const leaveRoomButton = document.createElement('button')
	leaveRoomButton.id = 'leave-room'
	leaveRoomButton.textContent = 'Leave Room'
	leaveRoomButton.onclick = leaveRoom
    
    const startGameButton = document.createElement('button')
    startGameButton.id = 'start'
    startGameButton.textContent = 'Start Game'
    startGameButton.onclick = () => {
        if (!host) return
        const settings = readSettings()
        socket.emit('startGame', settings)
        startGame()
    }

    const scoreboard = document.createElement('ul')
    scoreboard.id = 'scoreboard'

    const ul = document.createElement('ul')
    ul.id = 'chat'

    const messageDiv = document.createElement('div')
	messageDiv.appendChild(input)
	messageDiv.appendChild(sendButton)
    div.appendChild(leaveRoomButton)
    div.appendChild(startGameButton)

    const leftDiv = document.createElement('div')
    leftDiv.id = 'left-div'
    leftDiv.replaceChildren(h2, renderRoomSettings(), div)

    const rightDiv = document.createElement('div')
    rightDiv.id = 'right-div'
    rightDiv.replaceChildren(scoreboard, ul, messageDiv)

	document.querySelector('#main-content').replaceChildren(leftDiv, rightDiv)
}

function renderRoomSettings() {
    const parent = document.createElement('div')
    Object.entries(options).forEach(([key, value]) => {
        const div = document.createElement('div')
        div.onchange = () => { 
            socket.emit('updateSettings', readSettings())
        }

        const label = document.createElement('label')
        label.for = key
        label.innerText = key

        const select = document.createElement('select')
        select.id = key
        select.disabled = !host

        value.forEach(option => {
            const optionElement = document.createElement('option')
            optionElement.value = option
            optionElement.innerText = option
            select.appendChild(optionElement)
        })

        div.append(label)
        div.append(select)
        parent.appendChild(div)
    })
    return parent
}

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
    brushSizeInput.onchange = () => { setBrushSize(brushSizeInput.value) }
    
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

    const hintButton = document.createElement('button')
    hintButton.id = 'hint-button'
    hintButton.textContent = 'Hint'
    hintButton.onclick = () => socket.emit('hint')
    
    const skipButton = document.createElement('button')
    skipButton.id = 'skip-button'
    skipButton.textContent = 'Skip Turn'
    skipButton.onclick = () => socket.emit('skipTurn')

    const toolsDiv = document.querySelector('#draw-tools')
    toolsDiv.replaceChildren(drawCursor, eraseButton, clearButton, undoButton, colorPickerButton, fillButton, saveButton, brushSizeInput, colorPalette, hintButton, skipButton)
}

function removeDrawTools() {
    const toolsDiv = document.querySelector('#draw-tools')
    toolsDiv.replaceChildren()
}

function renderPlayer(playerName, playerId, playerScore = 0) {
    const player = document.createElement('li')
    player.id = playerId

    const name = document.createElement('span')
    name.className = 'name'
    name.innerText = playerName

    const score = document.createElement('span')
    score.className = 'score'
    score.innerText = playerScore

    player.appendChild(name)
    player.appendChild(document.createTextNode(' - '))
    player.appendChild(score)

    document.querySelector('#scoreboard').appendChild(player)
}