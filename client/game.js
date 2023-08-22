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
    updateRoundNumber(data.round)
}

function onGuessTurn(data) {
    updateTitle(`Guess the word: ${data.hint}`)
    removeDrawTools()
    setDrawMode(null)
    setTimer(data.time)
    updateRoundNumber(data.round)
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
    stopTimer()
    data.scores.sort((p1, p2) => p2.score - p1.score)
    data.scores.forEach(obj => {
        updatePlayerScore(obj.playerName, obj.playerId, obj.score)
    })
}

function onHint(hint) {
    updateTitle(`Guess the word: ${hint}`)
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

function updateRoundNumber(roundNumber) {
    document.querySelector('#round-number').innerHTML = `Round ${roundNumber}`
}

function deletePlayerScore(playerId) {
    document.getElementById(`${playerId}`).remove()
}