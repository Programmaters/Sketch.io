
export function onMessage(socket, message) {

    /** TODO:
     * If player is drawing, send message to room for players who have already guessed
     * If player is guessing, send message to room for players who are drawing:
     *    - if message has a max difference of 2 characters from the word, check if its correct, and if not if its close and tell user -> do not broadcast message
     *    - else broadcast message
     *  
     * If the player guessed, send message to room for players who have already guessed
    */

    socket.broadcast.emit('message', `${socket.id}: ${message}`)
}

