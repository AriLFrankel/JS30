// Elements

const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges = player.querySelectorAll('.player__slider')

// functions

function togglePlay() {
  // paused is a property on a video. There is no playing property
  return  video.paused ? video.play() : video.pause()
}

function toggleButton() {
  toggle.textContent = this.paused ? '►' : '▋▋' 
}

function skip() {
  video.currentTime += Number(this.dataset.skip)
}

function rangeUpdate() {
  // we intentionally matched the name property to the value that we want to udpate
  video[this.name] = this.value
}

function progressUpdate() {
  // we'll utilize the flex-basis property, which is a flex property
  progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`
}

let mouseDown = false

function scrub(e) {
  // note that the offset value on e is relative to the bar
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration
}
toggle.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)
video.addEventListener('play', toggleButton)
video.addEventListener('playing', toggleButton)
video.addEventListener('pause', toggleButton)

video.addEventListener('timeupdate', progressUpdate)

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip) )

ranges.forEach(range => range.addEventListener('change', rangeUpdate) )

progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e))
progress.addEventListener('mousedown', () => mouseDown = true)
progress.addEventListener('mouseup', () => mouseDown = false)