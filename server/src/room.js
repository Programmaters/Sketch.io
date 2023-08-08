import { Player } from './player.js'

/**
 * @class Room
 * @description Represents a single room
 * @param {Socket} socket
 */
export class Room {

    constructor(roomId, io, socket, game, canvas) {
        this.roomId = roomId
        this.io = io
        this.socket = socket
        this.game = game
        this.canvas = canvas 
    }

    /**
     * Joins a room with the given id and username
     * @param {Object} data 
     */
    join(socket, username) {
        if (this.players.length >= this.game.settings.maxPlayers) throw new Error('Room is full')
        const player = new Player(socket, username)
        this.game.players.push(player)
        socket.join(this.roomId)
    }

    /**
     * Leaves the room the user is in
     * @param {Object} data
     */
    leave(socket, playerId) {
        this.game.players = this.players.filter(player => player.id != playerId)
        socket.leave(this.roomId)
    }

    newGame() {
        this.game.startGame()
    }

    onMessage(playerId, message) {
        const player = this.players.find(player => player.id == playerId)
        if(!this.game.running) {
            this.io.in(this.roomId).emit('message', `${player.name}: ${message}`)
            return
        }
        this.game.onMessage(player, message)
    }

    /**
     * Updates the settings of the game
     * @param {Object} data
     */
    updateSettings(settings) {
        this.game.settings = settings
        this.players.forEach(player => {
            player.socket.emit('updateSettings', settings)
        })
    }

    get players() {
        return this.game.players
    }

    get settings() {
        return this.game.settings
    }
}