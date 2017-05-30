const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')
const filterSelect = document.querySelector('.filterSelect')

let filters = {
  None: null,
  'RGBSplit': rgbEffect,
  red: redEffect,
  green: greenEffect,
  blue: blueEffect
}
let filter

function changeFilter () {
  filter = filters[filterSelect.value]
  clearInterval(window.render)
  console.log(filterSelect.value)
  paintToCanvas()
}

function getVideo () {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      video.src = window.URL.createObjectURL(localMediaStream)
      video.play() 
    })
    .catch((err)=>{
      alert('please allow the webcam to run')
    })
}

function paintToCanvas () {
  const {videoWidth: width, videoHeight: height} = video
  canvas.width = width
  canvas.height = height
  window.render = setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height)
    pixels = filter ? filter(pixels) : pixels
    ctx.putImageData(pixels, 0, 0)
  }, 10)
  return window.render
}

function takePhoto () {
  snap.currentTime = 0
  snap.play() 

  const picture = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = picture
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${picture}" alt="handsome dude">`
  strip.insertBefore(link, strip.firstChild)
}

function redEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 200
  }
  return pixels
}

function greenEffect (pixels) {
  for(let i = 1; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 200
  }
  return pixels
}

function blueEffect (pixels) {
  for(let i = 2; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 200
  }
  return pixels
}

// every fourth because it goes R, G, B, A in the clampedArray
function rgbEffect  (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i]
    pixels.data[i + 100] = pixels.data[i + 1]
    pixels.data[i - 150] = pixels.data[i + 2]
  }
  return pixels
}

getVideo()

video.addEventListener('canplay', paintToCanvas) 