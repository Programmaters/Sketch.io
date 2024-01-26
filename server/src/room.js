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
        if (this.players.length >= this.game.gameConfig.maxPlayers) throw new Error('Room is full')
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

    onMessage(player, message) {
        if(!this.game.running) return true
        return this.game.onMessage(player, message)
    }

    updateGameConfig(gameConfig) {
        this.game.gameConfig = gameConfig
    }

    get players() {
        return this.game.players
    }

    get gameConfig() {
        return this.game.gameConfig
    }
}