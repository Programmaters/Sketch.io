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
    leftDiv.replaceChildren(h2, renderLobbySettings(), div)

    const rightDiv = document.createElement('div')
    rightDiv.id = 'right-div'
    rightDiv.replaceChildren(scoreboard, ul, messageDiv)

	document.querySelector('#main-content').replaceChildren(leftDiv, rightDiv)
	
    
    if (data.players) {
        data.players.forEach(playerJoinedRoom)
    } else {
        playerJoinedRoom(data.username)
    }
}

function leaveRoom() {
    socket.emit('leaveRoom', { username })
    renderHomepage()
}

function playerJoinedRoom(username) {
    const el = document.createElement('li')
    el.innerText = `${username} joined the room`
    document.querySelector('#chat').appendChild(el)
    addPlayerToScoreboard(username)
}

function addPlayerToScoreboard(playerName) {
    const player = document.createElement('li')
    player.id = playerName

    const name = document.createElement('span')
    name.className = 'name'
    name.innerText = playerName

    const score = document.createElement('span')
    score.className = 'score'
    score.innerText = 0

    player.appendChild(name)
    player.appendChild(document.createTextNode(' - '))
    player.appendChild(score)

    document.querySelector('#scoreboard').appendChild(player)
}

function playerLeftRoom(username) {
	const el = document.createElement('li')
	el.innerText = `${username} left the room`
	document.querySelector('#chat').appendChild(el)
    removePlayerFromScoreboard(username)
}

function removePlayerFromScoreboard(playerName) {
    // TODO()
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
