import readFileSync from 'fs'
import { timeout, getRandomFrom, broadcast } from './utils.js'


const words = readFileSync('./words.txt', 'utf-8').split('\n').map(word => word.trim())
// const randomWords = Array.from({ length: this.settings.wordCount }, () => words[Math.floor(Math.random() * words.length)]);

/**
 * @class Round
 * @description Represents a single round in a single game
 */
class Round {
    
    constructor(players) {
        this.players = players
        this.turnIndex = 0
        this.drawer = null
        this.guessers = []
        this.canvas = new Canvas()
        this.word = null
    }

    /**
     * Starts a new turn
     */
    async newTurn() {
        drawer = players[turnIndex]
        guessers = [...players].splice(turnIndex, 1)
        word = getRandomFrom(words)
        drawer.socket.emit('drawTurn', word)
        guessers.forEach(player => player.socket.emit('guessTurn'))

        await timeout(this.settings.drawTime, async () => { // wait for drawTime seconds
            endTurn()
            await timeout(5, () => { // wait for 5 seconds (check if this works)
                newTurn()
            })
        })
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
     * Resets the turn index
     */
    resetTurnIndex() {
        turnIndex = 0
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