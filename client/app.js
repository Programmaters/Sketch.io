const socket = io('ws://localhost:8080')

socket.on('message', receiveMessage)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('playerLeftRoom', playerLeftRoom)
socket.on('startGame', startGame)
socket.on('drawingAction', onDrawingAction)
socket.on('canvasData', onCanvasData )
socket.on('clearCanvas', clearCanvas)

socket.on('drawTurn', onDrawTurn)
socket.on('guessTurn', onGuessTurn)


socket.on('turnEnd', onTurnEnd)
socket.on('roundEnd', onRoundEnd)
socket.on('endGame', onGameEnd)

socket.on('correctGuess', () => alert('You guessed it right!'))
socket.on('playerGuessed', message => alert(message))

socket.on('closeGuess', data => alert(data.message))

socket.on('error', error => alert(error.message))


document.addEventListener('DOMContentLoaded', renderHomepage)
