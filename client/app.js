const socket = io('ws://localhost:8080')
let username = null
let host = false

socket.on('message', receiveMessage)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('playerLeftRoom', playerLeftRoom)
socket.on('drawingAction', onDrawingAction)
socket.on('canvasData', onCanvasData )
socket.on('clearCanvas', clearCanvas)
socket.on('showHint', onHint)
socket.on('gameStarted', startGame)
socket.on('drawTurn', onDrawTurn)
socket.on('guessTurn', onGuessTurn)
socket.on('endTurn', onEndTurn)
socket.on('roundEnd', onRoundEnd)
socket.on('endGame', onGameEnd)
socket.on('correctGuess', correctGuess)
socket.on('closeGuess', closeGuess)
socket.on('playerGuessed', receiveMessage)
socket.on('error', error => alert(error.message))

document.addEventListener('DOMContentLoaded', renderHomepage)
