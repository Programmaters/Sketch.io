const socket = io('ws://localhost:8080')


socket.on('message', message)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('error', error => {
	alert(error.message)
})

document.querySelector('#create-room').onclick = () => {
	const username = document.querySelector('#username').value
	socket.emit('createRoom', { username })
}

document.querySelector('#join-room').onclick = () => {
	const roomId = document.querySelector('#join-room-id').value
	const username = document.querySelector('#username').value
	socket.emit('joinRoom', { roomId, username })
}