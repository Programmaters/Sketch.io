import { broadcast } from '../utils.js'


/**
 * @class Game
 * @description Represents a single game in a single lobby
 * @param {Array[Socket]} players
 */
class Game {
    
    constructor(players, settings) {
        this.resetScores()
        this.players = players // Player[]
        this.settings = settings // object
        this.round = null // Round
        this.roundNumber = 1 // number
        this.scores = {} // object
    }

    /**
     * Starts the game
     */
    startGame() {
        clearScores()
        newRound()
        broadcast(this.players, 'start', this.word)       
    }

    /**
     * Resets the scores of all players
     */
    resetScores() {
        players.forEach(player => {
            this.scores[player.id] = 0
        })
    }

    /**
     * Starts a new round
     */
    newRound() {
        if (rounds++ >= this.settings.rounds) throw new Error('Game has already ended')
        round = new Round(this.players)
    }

    /**
     * Ends the round
     */
    endRound() {
        round = null
        broadcast(this.players, 'endRound', this.scores)
        resetTurnIndex()

        if (rounds++ >= this.settings.rounds) {
            endGame()
        }
    }

    /**
     * Ends the game
     */
    endGame() {
        broadcast(this.players, 'endGame')
    }
}