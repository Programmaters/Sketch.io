import { getRandomWords, getCloseness } from './utils.js'
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
        this.roundNumber = 1
        this.canvas = new Canvas()
        this.currentWord = null
        this.drawer = null
        this.controller = null
    }

    /**
     * Starts the game
     */
    async startGame() {
        this.resetScores()
        this.roundNumber = 1
    
        this.socket.broadcast.to(this.roomId).emit('startGame')
        for (let round = 0; round < this.settings.rounds; round++) {
            for (let player = 0; player < this.players.length; player++) {
                console.log(`Round ${round + 1} | Player ${player + 1}`)
                await this.nextTurn(player)
            }
        }
        this.socket.broadcast.to(this.roomId).emit('endGame')
    }


    /**
     * Starts a new turn
     * @param {Integer} playerIndex 
     */
    async nextTurn(playerIndex) {

        this.canvas.clear()
        this.io.to(this.roomId).emit('clearCanvas')
        this.resetGuessed()
        const drawer = this.players[playerIndex]
        drawer.guessed = true
        drawer.drawer = true
        this.drawer = drawer
        this.controller = new AbortController()
        const guessers = this.players.filter(player => player.id !== drawer.id)

        this.currentWord = getRandomWords(1)[0]

        drawer.socket.emit('drawTurn', { word: this.currentWord, time: this.settings.drawTime })
        guessers.forEach(player => player.socket.emit('guessTurn', { wordLength: this.currentWord.length, time: this.settings.drawTime }))
        
        try {
            await this.setCancellableTimeout(this.settings.drawTime)
        } catch {}
        
        await this.setTimeout(5) // wait for 5 seconds before starting new turn
    }

    onMessage(player, message) {
        const guessWord = message.toLowerCase().trim()
        const currentWord = this.currentWord.toLowerCase()
        if (guessWord === '') return
        const closeness = getCloseness(guessWord, currentWord)
        if (guessWord === currentWord) {
            if (!player.guessed) {
                player.socket.emit('correctGuess', 'You guessed it right!')
                player.socket.broadcast.emit('playerGuessed', `${player.name} has guessed the word!`)
                
                // update and emit scores to players
                player.score += 10
                player.guessed = true
                this.drawer.score += 5
                const scores = this.players.map(player => ({ id: player.id, score: player.score }))
                this.io.to(this.roomId).emit('updateScore', scores)
    
                // if everyone guessed, end turn
                if (this.players.every(player => player.guessed)) {
                    this.controller.abort() // cancels the timeout
                    this.endTurn()
                }
            }
          
        } else if (closeness >= closeThreshold) {
            this.sendMessage(message)
            if (!player.guessed) player.socket.emit('closeGuess', { message: `${guessWord} is close!` })
        } else {
            this.sendMessage(message)
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
     * Ends the turn
     */
    endTurn() {}

    /**
     * Ends the game
     */
    endGame() {
        this.resetScores()
        this.resetGuessed()
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


    /**
     * Cancellable timeout
     */
    async setCancellableTimeout(time) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time * 1000)
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