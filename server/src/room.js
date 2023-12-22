import { Player } from './player.js'

/**
 * @class Room
 * @description Represents a single room
 */
export class Room {

    constructor(id, io, socket, game, canvas) {
        this.id = id
        this.io = io
        this.socket = socket
        this.game = game
        this.canvas = canvas
    }

    join(socket, username) {
        if (this.players.length >= this.game.settings.maxPlayers) throw new Error('Room is full')
        const player = new Player(socket, username)
        this.game.players.push(player)
        socket.join(this.id)
    }

    leave(socket, playerId) {
        this.game.players = this.players.filter(player => player.id !== playerId)
        socket.leave(this.id)
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
            this.io.in(this.id).emit('message', { text: message, sender: player.name })
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