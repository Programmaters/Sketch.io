let timeleft = 10
let startTime = 0
let currentTime = 0


function setup() {

    noCanvas()
    startTime = millis()
    var timer = select('#timer')
    timer.html(timeleft - currentTime)
    var interval = setInterval(timeIt, 1000)

    function timeIt() {
        currentTime = floor((millis() - startTime) / 1000)
        timer.html(timeleft - currentTime)
        if (currentTime == timeleft) {
            clearInterval(interval)
        }
    }

}
