import { Player } from './player.js'

/**
 * @class Room
 * @description Represents a single room
 */
export class Room {

    constructor(roomId, io, socket, game, canvas) {
        this.roomId = roomId
        this.io = io
        this.socket = socket
        this.game = game
        this.canvas = canvas
    }

    join(socket, username) {
        if (this.players.length >= this.game.settings.maxPlayers) throw new Error('Room is full')
        const player = new Player(socket, username)
        this.game.players.push(player)
        socket.join()
    }

    leave(socket, playerId) {
        this.game.players = this.players.filter(player => player.id !== playerId)
        socket.leave(this.roomId)
    }

    newGame() {
        this.game.startGame()
    }

    getPlayers(){
        return this.players.map(player => ({ name: player.name, id: player.id }));
    }

    onMessage(playerId, message) {
        const player = this.players.find(player => player.id === playerId)
        if(!this.game.running) {
            this.io.in(this.roomId).emit('message', `${player.name}: ${message}`)
            return
        }
        this.game.onMessage(player, message)
    }

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