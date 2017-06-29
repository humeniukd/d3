import './app.css'
import prepare from './audio'
import Worker from './worker'
import Player from './player'
import freq from './frequency'

const height = 200
const width = 800
const worker = Worker()

let player, flag

const fx = () => {
  player.disconnect()
  player.mode = (player.mode + 1) % 3
  player.connect()
}

document.querySelector('button').addEventListener('click', fx)

const init = (buffer) => {
  player && player.stop()
  player = new Player(buffer)
}

const progress = () => {
  requestAnimationFrame(progress)
  console.log(player.currentTime)
}

const input = document.querySelector('input')

document.addEventListener('keyup', (e) => {
  if(32 === e.keyCode)
    player.pause()
  else if(70 === e.keyCode)
    fx()
  else if( 13 === e.keyCode)
    !flag ? (input.click(), flag = true) : flag = false

})

input.addEventListener('change', e => prepare(e.target.files[0]).then(b => {
  init(b)
  worker.postMessage(b.getChannelData(0))
  worker.onmessage = ({data}) => {
    console.log(data)
    player.play()
    progress()
    freq()
  }
}))
