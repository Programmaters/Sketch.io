
function startGame(data) {
    const settings = readSettings()
    socket.emit('startGame', settings)
    renderCanvas()
}

function onDrawTurn(data) {
    document.querySelector('h1').innerText = 'Draw the word: ' + data.word
    renderDrawTools()
    setDrawMode('draw')
    setTimer(data.time)
}

function onGuessTurn(data) {
    document.querySelector('h1').innerText = 'Guess the word: ' + "_ ".repeat(data.wordLength)
    removeDrawTools()
    setDrawMode(null)
    setTimer(data.time)
}


function onTurnEnd(data) {
    document.querySelector('h1').innerText = 'Turn ended'
}

function onRoundEnd(data) {
    document.querySelector('h1').innerText = 'Round ended'
}


function onGameEnd(data) {
    document.querySelector('h1').innerText = 'Game ended'
}
