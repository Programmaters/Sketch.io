let username = null
let host = false

function message(text) {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
}
