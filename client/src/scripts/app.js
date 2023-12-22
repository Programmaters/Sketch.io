import { io } from 'socket.io-client'

let username = null
let host = false
const socket = io('ws://localhost:8080')

socket.on('message', receiveMessage)
socket.on('joinedRoom', joinRoom)
socket.on('playerJoinedRoom', playerJoinedRoom)
socket.on('playerLeftRoom', playerLeftRoom)
socket.on('updateSettings', updateSettings)
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
socket.on('error', error => alert(error))
socket.on('disconnect', onDisconnect)

document.addEventListener('DOMContentLoaded', renderHomepage)