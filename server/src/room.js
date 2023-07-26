import { Game } from './game.js'

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
    async join(socket, name) {
        const player = new Player(socket, name)
        this.players.push(player)
        this.socket.join(id)
        this.socket.to(id).emit('joinRoom', data.player)

        // const players = Array.from(await io.in(id).allSockets())
    }

    /**
     * Leaves the room the user is in
     * @param {Object} data
     */
    leave(playerId) {
        this.players = this.players.filter(player => player.id != playerId)
        this.socket.leave(roomId)
        this.socket.to(roomId).emit('leaveRoom', data.player)
    }


    newGame() {
        this.game = new Game(this.io, this.socket, this.players, this.settings, this.roomId)
    }

    onMessage(playerId, message) {
        if(this.game == null) {
            this.game.sendMessage(message)
            return
        }
        this.game.onMessage(playerId, message)
    }


    /**
     * Updates the settings of the game
     * @param {Object} data
     */
    updateSettings(settings) {
        this.settings = settings
        this.players.forEach(player => {
            player.socket.emit('onUpdateSettings', settings)
        })
    }
}