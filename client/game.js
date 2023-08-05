function startGame() {
    renderCanvas()
    const canvas = createCanvas(width, height)
    canvas.style('visibility', 'visible')
    canvas.parent('canvas-container')
    pixelDensity(1)
    clearCanvas()
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    handleMouseMove(canvas)
}

function onDrawTurn(data) {
    updateTitle(`Draw the word: ${data.word}`)
    renderDrawTools()
    setDrawMode('draw')
    setTimer(data.time)
}

function onGuessTurn(data) {
    updateTitle(`Guess the word: ${data.hint}`)
    removeDrawTools()
    setDrawMode(null)
    setTimer(data.time)
}

function correctGuess(word) {
    receiveMessage('You guessed it right!', 'green')
    updateTitle(`Guess the word: ${word}`)
}

function closeGuess(message) {
    receiveMessage(message, 'yellow')
}

function onEndTurn(data) {
    updateTitle(`The word was: ${data.word}`)
    data.scores.sort((player1, player2) => player1.score - player2.score)
    data.scores.forEach(obj => {
        updatePlayerScore(obj.playerName, obj.playerId, obj.score)
    })
}

function onHint(hint) {
    updateTitle(hint)
}

function onRoundEnd() {
    updateTitle('Round ended')
}

function onGameEnd() {
    updateTitle('Game ended')
}

function updatePlayerScore(playerName, playerId, score) {
    deletePlayerScore(playerId)
    renderPlayer(playerName, playerId, score)
}

function updateTitle(title) {
    document.querySelector('h1').innerHTML = title
}

function deletePlayerScore(playerId) {
    document.getElementById(`${playerId}`).remove()
}