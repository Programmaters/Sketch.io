const options = {
    maxPlayers: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    language: ['English', 'Portuguese'],
    drawTime: [30, 45, 60, 80, 100, 120, 150, 180],
    rounds: [3, 4, 5, 6, 7, 8, 9, 10],
    wordCount: [1, 2, 3, 4, 5],
    hints: [0, 1, 2, 3, 4, 5]
}

function joinRoom(data) {
    const h2 = document.createElement('h2')
	h2.innerText = `Room ${data.roomId}`
	const div = document.createElement('div')
	const input = document.createElement('input')
	input.id = 'message'
	input.placeholder = 'message'
	const sendButton = document.createElement('button')
	sendButton.id = 'send-button'
	sendButton.innerText = 'Send'
	sendButton.onclick = () => {
		const input = document.querySelector('#message')
		socket.emit('message', { message: input.value, roomId: data.roomId, username })
		input.value = ""
	}

	const leaveRoomButton = document.createElement('button')
	leaveRoomButton.id = 'leave-room'
	leaveRoomButton.textContent = 'Leave Room'
	leaveRoomButton.onclick = () => {
		socket.emit('leaveRoom', { roomId: data.roomId, username })
		renderHomepage()
    }
    
    const startGameButton = document.createElement('button')
    startGameButton.id = 'start'
    startGameButton.textContent = 'Start Game'
    startGameButton.onclick = () => {
        const settings = readSettings()
        socket.emit('startGame', settings)
        drawing = true
        renderCanvas()
    }

    const ul = document.createElement('ul')
    const messageDiv = document.createElement('div')
	messageDiv.appendChild(input)
	messageDiv.appendChild(sendButton)
    div.appendChild(leaveRoomButton)
    div.appendChild(startGameButton)
	document.querySelector('#main-content').replaceChildren(h2, renderLobbySettings(), div, messageDiv, ul)
	
	playerJoinedRoom(data)
}

function playerJoinedRoom(data) {
    const el = document.createElement('li')
    el.innerText = `${data.username} joined the room`
    document.querySelector('ul').appendChild(el)
}

function playerLeftRoom(data) {
	const el = document.createElement('li')
	el.innerText = `${data.username} left the room`
	document.querySelector('ul').appendChild(el)
}


function renderLobbySettings() {
    const parent = document.createElement('div')
    Object.entries(options).forEach(([key, value]) => {
        const div = document.createElement('div')
        div.onclick = () => { 
            socket.emit('onUpdateSettings', readSettings())
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


/**
 * Get the selected option of a select element by id
 * @param {String} id 
 */
function getSelectedOptionOf(id) {
    const select = document.getElementById(id)
    return select.options[select.selectedIndex].value
}

/**
 * Get the game settings for the game
 */
function readSettings() {
    const settings = ["maxPlayers", "language", "drawTime", "rounds", "wordCount", "hints"]
    return settings.reduce((acc, setting) => {
        acc[setting] = getSelectedOptionOf(setting)
        return acc
    }, {})
}
