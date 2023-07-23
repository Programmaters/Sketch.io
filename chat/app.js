const socket = io('ws://localhost:8080')
const testString = "test"
const closeGuess = 0.75

socket.on('message', text => {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
})

document.querySelector('#send-button').onclick = () => {
    const input = document.querySelector('input')
    const guess = compareTwoWords(input.value, testString)

    switch (guess) {
        case 1:
            socket.emit('message', "You guessed correctly!")
            break;
        case closeGuess:
            socket.emit('message', input.value)
            const elem = document.createElement('li')
            elem.innerHTML = "You were close!"
            document.querySelector('ul').appendChild(elem)
            break;
        default:
            socket.emit('message', input.value)

    }

    const button = document.getElementById("send-button")
    button.innerText = "Send"
    input.value = ""
}



function compareTwoWords(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}