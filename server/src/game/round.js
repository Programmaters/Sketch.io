import readFileSync from 'fs'

const words = readFileSync('./words.txt', 'utf-8').split('\n').map(word => word.trim())

class Round {
    
    turns = []
    turnId = 0

    constructor(players) {
        this.players = players
    }

    startRound() {
    }

    nextTurn() {
        const randomWords = Array.from({ length: this.settings.wordCount }, () => words[Math.floor(Math.random() * words.length)]);
        turns.push(new Turn(players, randomWords, turnId))
        turnId++
    }


    getScore() {
        score = {}
        this.turns.forEach(turn => {
            this.score[turn.getPlayer] = turn.getScore()

        })
        return score
    }

    endRound() {
    }
}