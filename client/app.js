const socket = io('ws://localhost:8080')

socket.on('message', receiveMessage)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('playerLeftRoom', playerLeftRoom)
socket.on('startGame', startGame)
socket.on('error', error => alert(error.message))


socket.on('drawTurn', (data) => {
    document.querySelector('h1').innerText = 'Draw the word: ' + data.word

   
})
socket.on('guessTurn', (data) => {
    console.log(data.wordLength)
    document.querySelector('h1').innerText = 'Guess the word: ' + "_ ".repeat(data.wordLength);
})

document.addEventListener('DOMContentLoaded', renderHomepage)
