import {getCloseness, getHint, getRandomWords, hideWord} from './utils.js'
import {readFile} from 'node:fs/promises'

const closeThreshold = 0.75
const chooseWordTime = 15
const nextTurnTime = 5
const defaultConfig = await loadGameConfig()

async function loadGameConfig() {
    const data = await readFile('../config.json', 'utf8')
    const json = await JSON.parse(data)
    return json['defaultConfig']
}

/**
 * @class Game
 * @description Represents a single game in a single lobby
 * @param {Array[Player]} players
 */
export class Game {
    currentWord = null
    round = 1
    hint = ''
    drawer = null
    controller = null
    timeRef = null
    running = false
    inTurn = false

    constructor(io, socket, roomId, canvas) {
        this.io = io
        this.socket = socket
        this.players = []
        this.gameConfig = defaultConfig
        this.roomId = roomId
        this.canvas = canvas
    }

    /**
     * Starts the game
     */
    async startGame() {
        this.resetGame()
        this.running = true
        this.socket.broadcast.to(this.roomId).emit('gameStarted')
        for (let round = 1; round <= this.gameConfig.rounds; round++) {
            for (let player = 0; player < this.players.length; player++) {
                this.round = round
                const choseWord = await this.chooseWord(player)
                if (choseWord) await this.play()
            }
            this.endRound()
        }
        this.endGame()
    }

    async chooseWord(playerIndex) {
        this.canvas.clear()
        this.io.to(this.roomId).emit('clearCanvas')
        this.resetGuessed()
        const words = getRandomWords(this.gameConfig.wordCount, this.gameConfig.language)
        const drawer = this.players[playerIndex]
        drawer.guessed = true
        drawer.drawer = true
        this.drawer = drawer
        drawer.socket.emit('chooseWord', { words, time: chooseWordTime })
        drawer.socket.broadcast.to(this.roomId).emit('choosingWord', { drawer: drawer.name, time: chooseWordTime })

        try {
            this.currentWord = await new Promise((resolve, reject) => {
                const id = setTimeout(() => {
                    if (this.currentWord === null) reject(new Error('Word not chosen'))
                }, chooseWordTime * 1000)
                drawer.socket.on('wordChosen', ({word}) => {
                    clearTimeout(id)
                    resolve(word)
                })
            })
        } catch {}
        if (this.currentWord === null) {
            this.endTurn()
            return false
        }
        return true
    }

    /**
     * Starts a new turn
     */
    async play() {
        this.inTurn = true
        this.timeRef = new Date()
        this.drawer.socket.emit('drawTurn', { word: this.currentWord, round: this.round })
        this.drawer.socket.broadcast.to(this.roomId).emit('guessTurn', { word: hideWord(this.currentWord), round: this.round, drawer: this.drawer.id })
        try {
            await this.setCancellableTimeout(this.gameConfig.drawTime)
        } catch {}
        this.endTurn()
        await this.setTimeout(nextTurnTime) // wait for 5 seconds before starting new turn
    }

    onMessage(player, message) {
        if (!this.inTurn) return true
        const guessWord = message.toLowerCase().trim()
        if (guessWord === '' || this.drawer.id === player.id) return false

        const currentWord = this.currentWord.toLowerCase()
        if (guessWord === currentWord) {
            if (!player.guessed) {

                // update player scores 
                const timeLeft = parseInt(this.gameConfig.drawTime - (new Date() - this.timeRef) / 1000)
                this.drawer.score += parseInt(timeLeft / (this.getHintsGiven() + 1))
                player.score += timeLeft * this.players.length
                player.guessed = true

                // broadcast correct guess
                player.socket.emit('correctGuess', { text: `You guessed it right!`, word: this.currentWord })
                player.socket.broadcast.emit('playerGuessed', { player: { name: player.name, id: player.id}})
                this.io.in(this.roomId).emit('updateScore', { [player.id]: player.score, [this.drawer.id]: this.drawer.score })

                // if everyone guessed, end turn
                if (this.players.every(player => player.guessed)) {
                    this.controller.abort() // end turn
                }
            }
            return false
        } else {
            const closeness = getCloseness(guessWord, currentWord)
            if (closeness >= closeThreshold && !player.guessed) {
               player.socket.emit('closeGuess', { text: `${guessWord} is close!` })
            }
        }
        return true
    }

    getHintsGiven() {
        return this.hint.split('').filter(letter => letter !== '_' && letter !== ' ').length
    }

    /**
     * Sends a hint to all guessers in the room
     */
    sendHint() {
        const hintsGiven = this.getHintsGiven()
        if (hintsGiven >= this.gameConfig.hints) return
        const hint = getHint(this.currentWord, this.hint)
        this.hint = hint
        this.drawer.socket.broadcast.to(this.roomId).emit('showHint', { hint })
    }

    /**
     * Ends the turn
     */
    endTurn() {
        if (this.currentWord === null) { // drawer did not choose a word in time
            this.io.in(this.roomId).emit('endTurn')
            return
        }
        this.io.in(this.roomId).emit('endTurn', { word: this.currentWord, everyoneGuessed: this.players.every(player => player.guessed) })
        this.inTurn = false
        this.currentWord = null
        this.hint = ''
        this.resetGuessed()
        this.controller?.abort()
        this.canvas.clearHistory()
    }

    endRound() {
        this.io.in(this.roomId).emit('endRound')
    }

    /**
     * Ends the game
     */
    endGame() {
        this.running = false
        this.io.in(this.roomId).emit('endGame')
    }

    resetGame() {
        this.resetScores()
        this.resetGuessed()
        this.currentWord = null
        this.hints = ''
        this.drawer = null
        this.controller = null
        this.timeRef = null
    }

    /**
     * Resets all player scores
     */
    resetScores() {
        this.players.forEach(player => player.score = 0)
    }

    /**
     * Resets all player guessed states
     */
    resetGuessed() {
        this.players.forEach(player => {
            player.guessed = false
            player.drawer = false
        })
    }

    getPlayerScores() {
        return this.players.reduce((acc, player) => {
            acc[player.id] = player.score;
            return acc;
        }, {});
    }

    /**
     * Cancellable timeout
     */
    async setCancellableTimeout(time) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time * 1000)
            this.controller = new AbortController()
            this.controller.signal.addEventListener('abort', reject)
        })
    }

    /**
     * Timeout 
     */
    async setTimeout(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time * 1000)
        })
    }
}