function joinRoom(data) {
    renderRoom(data)
    if (data.players) {
        data.players.forEach(playerJoinedRoom)
    } else {
        playerJoinedRoom(data.player)
    }
}

function leaveRoom() {
    socket.emit('leaveRoom', { username })
    renderHomepage()
}

function playerJoinedRoom(player) {
    const el = document.createElement('li')
    el.innerText = `${player.name} joined the room`
    document.querySelector('#chat').appendChild(el)
    addPlayerToScoreboard(player.name, player.id)
}

function playerLeftRoom(player) {
	const el = document.createElement('li')
	el.innerText = `${player.name} left the room`
	document.querySelector('#chat').appendChild(el)
    removePlayerFromScoreboard(player.id)
}

function addPlayerToScoreboard(playerName, playerId) {
    renderPlayer(playerName, playerId)
}

function removePlayerFromScoreboard(playerId) {
    document.querySelector(`#\\${playerId}`).remove()
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

/**
 * Update the game settings
 */
function updateSettings(settings) {
    if (!host) {
        Object.entries(settings).forEach(([key, value]) => {
             const setting = document.getElementById(key)
             setting.value = value
         })
    }
    else return
}

const options = {
    maxPlayers: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    language: ['English', 'Portuguese'],
    drawTime: [30, 45, 60, 80, 100, 120, 150, 180],
    rounds: [3, 4, 5, 6, 7, 8, 9, 10],
    wordCount: [1, 2, 3, 4, 5],
    hints: [0, 1, 2, 3, 4, 5]
}