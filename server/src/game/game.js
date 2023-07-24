import { timeout, broadcast } from '../utils.js'


const maxUndos = 10

/**
 * Game class
 * @param {Array} players
 * 
 */
class Game {

    users = {}
    canvasData = []
    canvasTimeline = []
    prevCanvasData = []
    round = null
    rounds = 0
    scores = {}
    
    constructor(players, settings) {
        players.forEach(player => {
            this.scores[player.id] = 0
        })
        this.players = players
        this.settings = settings
    }

    async startGame() {
        newRound()
        broadcast(this.players, 'start', this.word)


        await timeout(this.settings.drawTime, async () => { // wait for drawTime seconds
            endRound()
            await timeout(5, () => { // wait for 5 seconds (check if this works)
                newRound()
            })
        })
    }

    newRound() {
        if (rounds++ >= this.settings.rounds) throw new Error('Game has already ended')
        round = new Round(this.players)
    }

    endRound() {
        round = null
        broadcast(this.players, 'endRound', this.scores)

        if (rounds++ >= this.settings.rounds) {
            endGame()
        }
    }

    endGame() {
        this.players.forEach(player => {
            player.socket.emit('endGame')
        })
    }
}