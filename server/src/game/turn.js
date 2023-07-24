class Turn {

    score = {}
    guesses = new Map()
    
    constructor(players, randomWords, id) {
        this.players = players
        this.randomWords = randomWords
        this.id = id
    }

    initiateTurn() {
        this.chooseDrawer()
        this.chooseGuessers()
        this.initiateScore()
    }

    initiateScore() {
        this.players.forEach(player => {
            this.score[player] = 0
        })
    }

    startTurn() {
        this.chooseWord()
    }

    chooseWord(word) {
        this.chosenWord = word
    }

    chooseDrawer() {
        this.drawer = players[id]
    }

    chooseGuessers() {
        this.guessers = this.players.splice(id, 1)
    }

    addGuess(word, player) {
        this.guesses.set(player, word)
    }

    getRightGuessers() {
        rightGuessers = []
        this.guesses.forEach((player, word) => {
            if (word === choosenWord) {
                rightGuessers.add(player)
            }
        })
        return rightGuessers
    }

    updateScore() {
        rightGuessers = this.getRightGuessers()
        this.players.forEach(player => {
            if (player === this.drawer) {
                this.score[player] += rightGuessers.length * 100
            }
            else {
                if (rightGuessers.includes(player)) {
                    this.score[player] += 100
                }
            }  
        })
    }

    getScore() {
        return score
    }

    endTurn() {
        this.getScore()
    }
}