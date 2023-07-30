
function renderHomepage() {
	const h1 = document.createElement('h1')
	h1.textContent = 'Sketch.io'

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

	document.getElementById('main-content').replaceChildren(h1, usernameInput, createRoomButton, joinRoomDiv)

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