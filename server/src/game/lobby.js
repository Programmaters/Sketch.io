

/**
 * Game class
 * @param {String} host
 * @param {Array} players
 * @param {Object} settings
 */
class Lobby {
    players = []
    settings = {
        maxPlayers: 8,
        language: 'English',
        drawTime: 60,
        rounds: 3,
        wordCount: 2,
        hints: 2
    }
    game = null

    constructor(host) {
        this.host = host;
        this.addPlayer(host);
    }

    newGame() {
        this.game = new Game(this.players);
    }

    updateSettings(settings) {
        this.players.forEach(player => {
            player.socket.emit('onUpdateSettings', settings);
        })
    }

    addPlayer(player) {
        this.players.push(player)
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.id != player.id)
    }
}