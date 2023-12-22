import { rooms } from './main.js'
import { readFile } from 'fs/promises'
import { randomUUID } from 'crypto'
import {Room} from "./room.js";

const enWords = await readFile('./words-en.txt', 'utf-8').then(x => x.split('\r\n'))
const ptWords = await readFile('./words-pt.txt', 'utf-8').then(x => x.split('\r\n'))

const dictionary = {
  'English': enWords,
  'Portuguese': ptWords
}

/**
 * Gets n number of random words
 * @param {Integer} numberOfNWords 
 * @returns array of n random words
 */
export function getRandomWords(n, language) {
    const words = dictionary[language]
    if(!words) throw new Error(`Language ${language} is not supported`)
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
    rooms[room.id] = room
}

export function wordHint(word) {
    return word.split(' ').map(subWord => '_ '.repeat(subWord.length)).join()
}

export function getRandomChars(word, nOfChars) {
    const hintArray = word.split('')
    const hintIndices = []
    let hintCount = 0
    
    for (let i = 0; i < hintArray.length; i++) {
        hintIndices.push(i)
    }
    
    for (let i = 0; i <= hintArray.length; i++) {
        const randomIndex = hintIndices[Math.floor(Math.random() * hintIndices.length)]
        if (hintArray[randomIndex] === ' ') {
            hintIndices.splice(hintIndices.indexOf(randomIndex), 1)
            continue
        }
        if (hintCount >= nOfChars) {
            hintArray[randomIndex] = '_'
        }
        hintIndices.splice(hintIndices.indexOf(randomIndex), 1)
        hintCount++
    }
    return hintArray
}


export function getHint(turn) {
    const hintChar = turn.hints.find(c => c != '_' && c != ' ')
    const hintArray = []
    for (let i = 0; i < turn.hints.length; i++) {
        if (turn.hints[i] != '_' && turn.hints[i] != ' ' && turn.hints[i] != hintChar) {
            hintArray.push('_')
        }
        else {
            hintArray.push(turn.hints[i])
        }
    }

    // remove hintChar from the available hints for the turn
    const hintCharIndex = turn.hints.indexOf(hintChar)
    turn.hints[hintCharIndex] = '_'

    if (turn.hintsToShow === null) {
        turn.hintsToShow = hintArray
    }
    else {
        turn.hintsToShow[hintCharIndex] = hintChar
    }

    const hintArraySeparated = turn.hintsToShow.join().split(' ')
    let hint = ['', '']
    for (let i = 0; i < hintArraySeparated.length; i++) {
        for(let j = 0; j < hintArraySeparated[i].length; j++) {
            if (hintArraySeparated[i][j] != '_') {
                hint[i] += hintArraySeparated[i][j] + ' '
            }
            if (hintArraySeparated[i][j] === '_') {
                hint[i] += '_ '
            }
        } 
    } 
    return hint.join()
}