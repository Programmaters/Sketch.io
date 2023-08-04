import { Game } from './game.js'
import { Player } from './player.js'

const defaultSettings = {
    maxPlayers: 2,
    language: 'English',
    drawTime: 30,
    rounds: 3,
    wordCount: 1,
    hints: 0
}

/**
 * @class Room
 * @description Represents a single room
 * @param {Socket} socket
 */
export class Room {

    constructor(roomId, io, socket) {
        this.roomId = roomId
        this.io = io
        this.socket = socket
        this.players = []
        this.settings = defaultSettings
        this.game = null
    }

    /**
     * Joins a room with the given id and username
     * @param {Object} data 
     */
    join(socket, username) {
        const player = new Player(socket, username)
        this.players.push(player)
        socket.join(this.roomId)
    }

    /**
     * Leaves the room the user is in
     * @param {Object} data
     */
    leave(socket, username) {
        this.players = this.players.filter(player => player.username != username)
        socket.leave(this.roomId)
    }

    newGame() {
        this.game = new Game(this.io, this.socket, this.players, this.settings, this.roomId)
    }

    onMessage(playerId, message) {
        const player = this.players.find(player => player.id == playerId)
        if(this.game == null) { // game hasnt started yet
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
        this.settings = settings
        this.players.forEach(player => {
            player.socket.emit('updateSettings', settings)
        })
    }
}