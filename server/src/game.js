import { games } from './main.js'
import { timeout, getRandomWords, getCloseness } from './utils.js'


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
    }

    /**
     * Starts the game
     */
    async startGame() {
        this.resetScores()
        this.roundNumber = 1
    
        this.io.in(this.roomId).emit('startGame')
        for (let round = 0; round < this.settings.rounds; round++) {
            for (let player = 0; player < this.players.length; player++) {
                await nextTurn(player)
            }
        }
        this.io.in(this.roomId).emit('endGame')
    }


    /**
     * Starts a new turn
     * @param {Integer} playerIndex 
     */
    async nextTurn(playerIndex) {

        this.canvas.clear()
        this.resetPlayers()
        const drawer = this.players[playerIndex]
        drawer.guessed = true
        drawer.drawer = true
        this.drawer = drawer
  
        const guessers = this.players.filter(player => player.id !== drawer.id)

        drawer.socket.emit('drawTurn', word)
        guessers.forEach(player => player.socket.emit('guessTurn'))
        
        this.currentWord = getRandomWords(1)[0]

        await timeout(this.settings.drawTime, async () => { // wait for drawTime seconds
            endTurn()
        })

        await timeout(5, () => { // wait for 5 seconds
            newTurn()
        })
    }

    onMessage(playerId, message) {
        const guessWord = message.toLowerCase().trim()
        if (guessWord === '') return
        const currentWord = games[socket.id].currentWord.toLowerCase()
        const closeness = getCloseness(guessWord, currentWord)
        const player = this.players[playerId]

        if (closeness === 1) {
            if (!player.guessed) {
                this.socket.emit('correctGuess', { message: 'You guessed it right!', id: socket.id })
                this.socket.broadcast.emit('correctGuess', { message: `${socket.player.name} has guessed the word!`, id: socket.id })
                
                // update and emit scores to players
                this.players[playerId].score += 10
                this.players[playerId].guessed = true
                this.drawer.score += 5
                const scores = this.players.map(player => ({ id: player.id, score: player.score }))
                this.io.in(roomId).emit('updateScore', scores)
    
                // if everyone guessed, end turn
                if(this.players.every(player => player.guessed)) {
                    endTurn()
                }
            }
          
        } else if (closeness >= closeThreshold) {
            sendMessage(message)
            if (!player.guessed) this.socket.emit('closeGuess', { message: `${guessWord} is close!` })
        } else {
            sendMessage(message)
        }
    }

    /**
     * Sends a message to all players in the room
     * @param {String} message 
     */
    sendMessage(message) {
        this.io.in(roomId).emit('message', message)
    }

    /**
     * Ends the turn
     */
    endTurn() {
        if(++turnIndex > this.players.length) {
            this.endRound()
        }
    }

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
        this.players.forEach(player => { this.scores[player.id] = 0 })
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
     * Draws on the canvas
     * @param {String} playerId 
     * @param {Object} data 
     * @returns 
     */
    drawCanvas(playerId, data) {
        if (playerId !== this.drawer.id) return
        this.canvas.draw(data)
    }
    
    /**
     * Clears the canvas
     */
    clearCanvas() {
        this.canvas.clear()
    }
    
    /**
     * Saves a copy of the canvas in the timeline
     */
    saveCanvas() {
        this.canvas.save()
    }
    
    /**
     * Undos the last action from the canvas
     */
    undoCanvas() {
        this.canvas.undo()
    }
}