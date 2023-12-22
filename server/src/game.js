import { getRandomWords, getRandomChars, getCloseness, wordHint, getHint } from './utils.js'

const closeThreshold = 0.75
const defaultSettings = {
    maxPlayers: 3,
    language: 'English',
    drawTime: 30,
    rounds: 3,
    wordCount: 1,
    hints: 0
}

/**
 * @class Game
 * @description Represents a single game in a single lobby
 * @param {Array[Player]} players
 */
export class Game {

    currentWord = null
    hintCounter = 0
    hints = null
    hintsToShow = null
    drawer = null
    controller = null
    timeRef = null
    running = false

    constructor(io, socket, roomId, canvas) {
        this.io = io
        this.socket = socket
        this.players = []
        this.settings = defaultSettings
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
        for (let round = 0; round < this.settings.rounds; round++) {
            for (let player = 0; player < this.players.length; player++) {
                console.log(`Round ${round + 1} | Player ${player + 1}`)
                await this.play(player, round + 1)
            }
        }
        this.socket.broadcast.to(this.roomId).emit('gameEnded')
    }

    /**
     * Starts a new turn
     * @param {Integer} playerIndex 
     */
    async play(playerIndex, roundNumber) {

        this.canvas.clear()
        this.io.to(this.roomId).emit('clearCanvas')
        this.resetGuessed()
        const drawer = this.players[playerIndex]
        drawer.guessed = true
        drawer.drawer = true
        this.drawer = drawer

        this.currentWord = getRandomWords(1, this.settings.language)[0]
        this.hints = getRandomChars(this.currentWord, this.settings.hints)
        this.hintsToShow = null
        this.timeRef = new Date()

        drawer.socket.emit('drawTurn', { word: this.currentWord, time: this.settings.drawTime, round: roundNumber })
        drawer.socket.broadcast.to(this.roomId).emit('guessTurn', { hint: wordHint(this.currentWord), time: this.settings.drawTime, round: roundNumber })
    
        try {
            await this.setCancellableTimeout(this.settings.drawTime)
        } catch {}
        
        this.endTurn()

        await this.setTimeout(5) // wait for 5 seconds before starting new turn
    }

    onMessage(player, message) {
        const guessWord = message.toLowerCase().trim()
        const currentWord = this.currentWord.toLowerCase()
        if (guessWord === '') return
        
        if (guessWord === currentWord) {
            if (!player.guessed) {
                player.socket.emit('correctGuess', this.currentWord)
                player.socket.broadcast.emit('playerGuessed', `${player.name} has guessed the word!`)
                
                // update player scores 
                const timeLeft = parseInt(this.settings.drawTime - (new Date() - this.timeRef) / 1000)
                const answerTime = this.settings.drawTime - timeLeft
                this.drawer.score += parseInt(answerTime / (this.hintCounter + 1))
                player.score += answerTime * this.players.length
                player.guessed = true
    
                // if everyone guessed, end turn
                if (this.players.every(player => player.guessed)) {
                    this.endTurn()
                }
            }
        } else {
            this.sendMessage(`${player.name}: ${message}`)
            const closeness = getCloseness(guessWord, currentWord)
            if (closeness >= closeThreshold) {
                if (!player.guessed) player.socket.emit('closeGuess', `${guessWord} is close!`)
            }
        }
    }

    /**
     * Sends a message to all players in the room
     * @param {String} message 
     */
    sendMessage(message) {
        this.io.in(this.roomId).emit('message', message)
    }

    /**
     * Sends a hint to all guessers in the room
     */
    sendHint() {
        let hint = getHint(this)
        this.drawer.socket.broadcast.to(this.roomId).emit('showHint', hint)
    }

    /**
     * Ends the turn
     */
    endTurn() {
        this.io.in(this.roomId).emit('endTurn', { word: this.currentWord, scores: this.getPlayerScores() })
        this.resetGuessed()
        this.controller.abort()
        this.hintCounter = 0
    }

    /**
     * Ends the game
     */
    endGame() {
        this.running = false
        this.io.in(roomId).emit('endGame')
    }

    resetGame() {
        this.resetScores()
        this.resetGuessed()
        this.currentWord = null
        this.hints = null
        this.hintsToShow = null
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
        return this.players.map(player => ({ playerName: player.name, playerId: player.id, score: player.score }))
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