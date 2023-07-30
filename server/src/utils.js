import { rooms } from './main.js'
import { readFile } from 'fs/promises'
import { randomUUID } from 'crypto'

const words = await readFile('./words.txt', 'utf-8').then(x => x.split('\n'))

/**
 * Waits for a given amount of time and then calls the callback function
 * @param {Integer} time 
 * @param {Function} callback 
 * @returns 
 */
export async function timeout(time, callback) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve(callback)
        }, time * 1000)
    })
}
 
/**
 * Gets n number of random words
 * @param {Integer} numberOfNWords 
 * @returns array of n random words
 */
export function getRandomWords(n) {
    return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)])
}

/**
 * Compares two words and returns a ratio of how close they are
 * @param {String} str1 
 * @param {String} str2 
 * @returns ratio of closeness between two strings, 0 being not close at all and 1 being identical
 */
export function getCloseness(str1, str2) {
	const maxLength = Math.max(str1.length, str2.length)
	let hammingDistance = 0
	for (let i = 0; i < maxLength; i++) {
        if (str1[i] !== str2[i]) hammingDistance++
	}
	return 1 - hammingDistance / maxLength
}

/**
 * Get a random id of length 8
 * @returns random id
 */
export function getRandomId() {
    return randomUUID().slice(0, 8)
}


/**
 * Gets a room by id and throws an error if it doesn't exist
 * @param {Socket} socket 
 * @param {String} id 
 * @returns room
 */
export function getRoom(id) {
    const room = rooms[id]
    if (!room) {
        throw new Error(`Room with id ${id} does not exist`)
    }
    return room
}

/**
 * Adds a room to the rooms object
 * @param {Room} room 
 */
export function addRoom(room) {
    rooms[room.roomId] = room
}