
/**
 * @class Player
 * @param {string} name
 * @param {Socket} socket
 */
class Player {    
    constructor(name, socket) {
        this.name = name
        this.socket = socket
        this.id = socket.id
    }
}