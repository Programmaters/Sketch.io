const socket = io('ws://localhost:8080')
const options = {
    maxPlayers: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    language: ['English', 'Portuguese'],
    drawTime: [30, 45, 60, 80, 100, 120, 150, 180],
    rounds: [3, 4, 5, 6, 7, 8, 9, 10],
    wordCount: [1, 2, 3, 4, 5],
    hints: [0, 1, 2, 3, 4, 5]
}

document.querySelector('#start').onclick = () => {
    const settings = readSettings()
    socket.emit('start', settings)
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body')
   
    Object.fromEntries(Object.entries(options).forEach(([key, value]) => {
        const div = document.createElement('div')
        div.onclick = () => { 
            socket.emit('onUpdateSettings', readSettings())
        }

        const label = document.createElement('label')
        label.for = key
        label.innerText = key

        const select = document.createElement('select')
        select.id = key

        value.forEach(option => {
            const optionElement = document.createElement('option')
            optionElement.value = option
            optionElement.innerText = option
            select.appendChild(optionElement)
        })

        div.append(label)
        div.append(select)
        body.appendChild(div)
    }))
})
