let username = null

function message(text) {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
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

	const ul = document.createElement('ul')
	div.appendChild(input)
	div.appendChild(sendButton)
	div.appendChild(leaveRoomButton)
	div.appendChild(ul)
	document.querySelector('#main-content').replaceChildren(h2, div)

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
	}
	
	document.querySelector('#join-room').onclick = () => {
		const roomId = document.querySelector('#join-room-id').value
		username = document.querySelector('#username').value
		socket.emit('joinRoom', { roomId, username })
	}
}