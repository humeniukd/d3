import './app.css'
import prepare from './audio'
import Worker from './worker'
import Player from './player'
import freq from './frequency'
import { select, mouse } from 'd3-selection'
import { scaleLinear, scaleTime } from 'd3-scale'
import { timeFormat } from 'd3-time-format'
import { axisLeft, axisRight, axisBottom } from 'd3-axis'
import { area } from 'd3-shape'

const height = 200
const width = 800
const worker = Worker()

let player, g, gradient, flag, timeDisplay, label, x

const fx = () => {
  player.disconnect()
  player.mode = (player.mode + 1) % 3
  player.connect()
}

document.querySelector('button').addEventListener('click', fx)

const wf = select('#wf')

const y = scaleLinear()
  .domain([0., 1.])
  .range([height, 0])

const Y = scaleLinear()
  .domain([-120, 0])
  .range([height, 0])

const YAxis = axisLeft(Y).ticks(5).tickSize(5)
const yAxis = axisRight(y).ticks(10).tickPadding(10).tickSize(0)

const a = area()
  .x((d, i) => i)
  .y0(height)
  .y1(d => y(d))

const A = area()
  .x((d, i) => i)
  .y0(height)
  .y1(d => {
    let db = -120
    if (d > 0)
      db = Math.log(d) / Math.LN10 * 20
    return Y(db)
  })

const init = (buffer) => {
  wf.html('')
  player && player.stop()
  player = new Player(buffer)

  x = scaleTime()
    .domain([0, player.duration*1000])
    .range([0, width])

  timeDisplay = x.tickFormat(16, timeFormat('%M:%S'))

  const xAxis = axisBottom(x).ticks(16).tickFormat(timeDisplay)

  const defs = wf.append('defs')
  gradient = defs.append('linearGradient').attr('id', 'progress')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%')

  gradient.append('stop')
    .attr('stop-color', 'magenta')
    .attr('offset', '0%')

  gradient.append('stop')
    .attr('stop-color', 'blueviolet')
    .attr('offset', '0%')

  g = wf.append('g')

  g.append('g')
    .attr('class', 'axis y left')
    .call(YAxis)
  g.append('g')
    .attr('class', 'axis y right')
    .attr('transform', `translate(${width},0)`)
    .call(yAxis)
  g.append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
  label = g.append('g')
    .append('text')
    .text('0:00')
    .attr('class', 'time')
    .attr('transform', `translate(${width-50},10)`)
}

const progress = () => {
  requestAnimationFrame(progress)
  const pos = player.currentTime / player.duration * 100
  label.text(timeDisplay(player.currentTime*1000))
  gradient.attr('x1', `${pos}%`)
}

wf.on('click', function() {
  const m = mouse(this)
  const x = m[0]
  const k = x/width
  player && player.play(k)
})
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
    g.append('path').attr('d', A(data)).attr('fill', 'url(#progress)')
    g.append('path').attr('d', a(data)).attr('fill', 'cyan')
    player.play()
    progress()
    freq()
  }
}))
