import { rooms } from './main.js'

const words = readFile('./words.txt', 'utf-8').split('\n')

export async function timeout(time, callback) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve(callback)
        }, time * 1000)
    })
}
 
export function getRandomWords(numberOfWords) {
    return Array.from({ length: numberOfWords }, () => words[Math.floor(Math.random() * words.length)])
}

export function getCloseness(str1, str2) {
	const maxLength = Math.max(str1.length, str2.length)
	let hammingDistance = 0
	for (let i = 0; i < maxLength; i++) {
        if (str1[i] !== str2[i]) hammingDistance++
	}
	return 1 - hammingDistance / maxLength
}

export function getRoom(socket, id) {
    const room = rooms[id]
    if (!room) {
        socket.emit('error', { error: 'Room does not exist' })
        throw new Error('Room does not exist')
    }
    return room
}