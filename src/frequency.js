import { select } from 'd3-selection'
import { ac } from './audio'

export const analyser = ac.createAnalyser()

const fftSize = 32
analyser.fftSize = fftSize
analyser.minDecibels = -90
analyser.maxDecibels = -10

const height = 100
const width = 400

const svg = select('#eq')

const frequencyData = new Uint8Array(analyser.frequencyBinCount)

const rects = svg.selectAll('rect')
  .data(frequencyData)
  .enter()
  .append('rect')
  .attr('x', (d, i) => i * width / frequencyData.length)
  .attr('width', width / frequencyData.length - 1)

const render = () => {
  requestAnimationFrame(render)

  // Copy frequency data to frequencyData array.
  analyser.getByteFrequencyData(frequencyData)

  // Update d3 chart with new data.
  rects.data(frequencyData)
    .attr('y', d => height - d)
    .attr('height', d => d)
    .attr('fill', d => `rgb(255, ${255-d}, 0)`)
}

export default render