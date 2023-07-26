const socket = io('ws://localhost:8080')

const testString = "test"
const closeThreshold = 0.75


socket.on('message', text => {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
})

document.querySelector('#send-button').onclick = () => {
    const input = document.querySelector('input')
	const closeRatio = distance(input.value, testString)
	
	if (closeRatio === 1) {
		socket.emit('message', "You guessed correctly!")
	} else if (closeRatio >= closeThreshold) {
		socket.emit('message', input.value)
		const elem = document.createElement('li')
		elem.innerHTML = "You were close!"
		document.querySelector('ul').appendChild(elem)
	} else {
		socket.emit('message', input.value)
	}
    const button = document.getElementById("send-button")
    button.innerText = "Send"
    input.value = ""
}

