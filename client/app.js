const socket = io('ws://localhost:8080')


socket.on('message', message)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('playerLeftRoom', playerLeftRoom)
socket.on('error', error => alert(error.message))

document.addEventListener('DOMContentLoaded', renderHomepage)

