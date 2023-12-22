/**
 * @class Player
 * @param {Socket} socket
 * @param {String} name
 */
export class Player {    
    constructor(socket, name) {
        this.socket = socket
        this.name = name
        this.drawer = false
        this.guessed = false
        this.score = 0
    }

    get id() {
        return this.socket.id
    }
}