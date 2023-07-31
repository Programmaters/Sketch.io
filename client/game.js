
function startGame() {
    renderCanvas()
}

function onDrawTurn(data) {
    document.querySelector('h1').innerText = 'Draw the word: ' + data.word
    renderDrawTools()
    setDrawMode('draw')
    setTimer(data.time)
    drawer = true
}

function onGuessTurn(data) {
    document.querySelector('h1').innerHTML = `Guess the word: ${data.hint}` 
    removeDrawTools()
    setDrawMode(null)
    setTimer(data.time)
    drawer = false
}

function correctGuess(word) {
    receiveMessage('You guessed it right!', 'green')
    document.querySelector('h1').innerText = `Guess the word: ${word}` 
}

function onEndTurn(data) {
    document.querySelector('h1').innerText = `The word was: ${data.word}` 

    data.scores.forEach(obj => {
        updatePlayerScore(obj.username, obj.score)
    })
}

function onRoundEnd(data) {
    document.querySelector('h1').innerText = 'Round ended'

    
}


function onGameEnd(data) {
    document.querySelector('h1').innerText = 'Game ended'
}

function updatePlayerScore(username, score) {
    document.querySelector('#scoreboard').querySelector(`#${username}`).querySelector('.score').innerText = score
}