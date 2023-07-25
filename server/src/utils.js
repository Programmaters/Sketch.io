async function timeout(time, callback) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve(callback)
        }, time * 1000)
    })
}
 

function broadcast(players, event, data) {
    players.forEach(player => {
        player.socket.emit(event, data)
    })
}

function getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)]
}