
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
    drawer = true
}

function onGuessTurn(data) {
    updateTitle(`Guess the word: ${data.hint}`)
    removeDrawTools()
    setDrawMode(null)
    setTimer(data.time)
    drawer = false
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
    data.scores.forEach(obj => {
        updatePlayerScore(obj.playerId, obj.score)
    })
}

function onRoundEnd() {
    updateTitle('Round ended')
}

function onGameEnd() {
    updateTitle('Game ended')
}

function updatePlayerScore(playerId, score) {
    document.querySelector('#scoreboard').querySelector(`#${playerId}`).querySelector('.score').innerText = score
}

function updateTitle(title) {
    document.querySelector('h1').innerText = title
}
