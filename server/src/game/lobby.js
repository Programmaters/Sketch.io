
const defaultSettings = {
    maxPlayers: 8,
    language: 'English',
    drawTime: 60,
    rounds: 3,
    wordCount: 2,
    hints: 2
}

/**
 * @class Lobby
 * @description Represents a single lobby
 * @param {Socket} host
 */
class Lobby {

    static lobbies = []

    constructor(host) {
        this.host = host // socket
        this.players = [] // Player[]
        this.settings = defaultSettings // object
        this.game = null // Game
        this.addPlayer(host)
        lobbies.push(this)
    }

    /**
     * Returns the lobby that the player is in
     * @param {String} playerId 
     * @returns 
     */
    static find(playerId){
        return lobbies.find(lobby => lobby.players.some(player => player.id == playerId))
    }

    /**
     * Creates a new game
     */
    newGame() {
        this.game = new Game(this.players)
    }

    /**
     * Updates the settings of the game
     * @param {Object} settings
     */
    updateSettings(settings) {
        this.players.forEach(player => {
            player.socket.emit('onUpdateSettings', settings);
        })
    }

    /**
     * Adds a player to the lobby
     * @param {Player} player 
     */
    addPlayer(player) {
        this.players.push(player)
    }

    /**
     * Removes a player from the lobby
     * @param {Player} player
     */
    removePlayer(player) {
        this.players = this.players.filter(p => p.id != player.id)
    }
}