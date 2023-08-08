let timeleft = 0
let startTime = 0
let currentTime = 0
let interval = 0

function setTimer(duration) {
    timeleft = duration
    startTime = millis()
    const timer = select('#timer')
    timer.html(timeleft - currentTime)
    interval = setInterval(timeIt, 1000)

    function timeIt() {
        currentTime = floor((millis() - startTime) / 1000)
        timer.html(timeleft - currentTime)
        if (currentTime == timeleft) {
            clearInterval(interval)
        }
    }
}

function stopTimer() {
    clearInterval(interval)
    const timer = select('#timer')
    timer.html(0)
} 