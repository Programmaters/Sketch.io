import { getRandomWords, getRandomChars, getCloseness, wordHint, getHint } from './utils.js'
import { Canvas } from './canvas.js'

const closeThreshold = 0.75

/**
 * @class Game
 * @description Represents a single game in a single lobby
 * @param {Array[Player]} players
 */
export class Game {

    constructor(io, socket, players, settings, roomId) {
        this.io = io
        this.socket = socket
        this.host = socket.id
        this.players = players
        this.settings = settings
        this.roomId = roomId
        this.canvas = new Canvas()
        this.currentWord = null
        this.hintCounter = 0
        this.hints = null
        this.hintsToShow = null
        this.drawer = null
        this.controller = null
        this.timeRef = null
    }

    /**
     * Starts the game
     */
    async startGame() {
        this.resetScores()
 
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

        this.currentWord = getRandomWords(1)[0]
        this.hints = getRandomChars(this.currentWord, this.settings.hints)
        this.hintsToShow = null
        this.timeRef = new Date()

        drawer.socket.emit('drawTurn', { word: this.currentWord, time: this.settings.drawTime })
        drawer.socket.broadcast.to(this.roomId).emit('guessTurn', { hint: wordHint(this.currentWord), time: this.settings.drawTime })
    
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

                if (this.hintCounter > 0) {
                    let penaltyScore = timeLeft / this.settings.hints
                    this.drawer.score += parseInt(timeLeft - (penaltyScore * (this.hintCounter * 0.1)))
                } else {
                    this.drawer.score += timeLeft
                }
                player.score += timeLeft * this.players.length
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
        this.resetScores()
        this.io.in(roomId).emit('endGame')
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
        return this.players.map(player => ({ playerId: player.id, score: player.score }))
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