import {rooms} from './main.js'
import {readFile} from 'fs/promises'
import {randomUUID} from 'crypto'
import {Room} from "./room.js";
import os from 'os'

const enWords = await readFile('./words-en.txt', 'utf-8').then(x => x.split(os.EOL))
const ptWords = await readFile('./words-pt.txt', 'utf-8').then(x => x.split(os.EOL))

const dictionary = {
  'English': enWords,
  'Portuguese': ptWords
}

/**
 * Gets n number of random words
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

export function hideWord(word) {
    return word.replace(/\S/g, '_');
}

export function getHint(correctWord, prevHint) {
    // if prevHint is blank, set it to all underscores
    if (!prevHint) {
        prevHint = hideWord(correctWord);
    }
    // get indices of underscores
    const hintArray = prevHint.split('');
    const underscoreIndices = [];
    for (let i = 0; i < hintArray.length; i++) {
        if (hintArray[i] === '_') {
            underscoreIndices.push(i);
        }
    }
    // no underscores left
    if (underscoreIndices.length === 0) {
        return correctWord;
    }
    // show a random letter in the correct word
    let randomIndex = underscoreIndices[Math.floor(Math.random() * underscoreIndices.length)];
    hintArray[randomIndex] = correctWord[randomIndex];
    return hintArray.join('');
}