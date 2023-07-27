

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
	const button = document.createElement('button')
	button.id = 'send-button'
	button.innerText = 'Send'
	button.onclick = () => {
		const input = document.querySelector('#message')
		socket.emit('message', { message: input.value, roomId: data.roomId })
		input.value = ""
	}
	const ul = document.createElement('ul')
	div.appendChild(input)
	div.appendChild(button)
	div.appendChild(ul)
	document.querySelector('#main-content').replaceChildren(h2, div)

	playerJoinedRoom(data)
}

function playerJoinedRoom(data) {
    const el = document.createElement('li')
    el.innerText = `${data.username} joined the room`
    document.querySelector('ul').appendChild(el)
}