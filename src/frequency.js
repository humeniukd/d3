import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { ac } from './audio'

export const analyser = ac.createAnalyser()

const fftSize = 32
analyser.fftSize = fftSize;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;

const height = 100;
const width = 400;

const svg = select('#eq').attr('height', height).attr('width', width);

const frequencyData = new Uint8Array(analyser.frequencyBinCount);

svg.selectAll('rect')
  .data(frequencyData)
  .enter()
  .append('rect')
  .attr('x', (d, i) => i * width / frequencyData.length)
  .attr('width', width / frequencyData.length - 1);

const chartGroup = svg.append('g').attr('transform', 'transform="translate(30)');

const y = scaleLinear()
  .domain([255, 0])
  .range([height, 0]);

const y1 = scaleLinear()
  .domain([0, -60])
  .range([0, height]);

const x = scaleLinear()
  .domain([4, frequencyData.length-1])
  .range([0, width]);

const yAxis = axisLeft(y1).ticks(3).tickSize(20);
const xAxis = axisBottom(x).ticks(frequencyData.length-1)
  .tickSize(width / frequencyData.length - 1)
  .tickPadding(-16)
  .tickFormat(d => {
    const val = Math.round(Math.pow(10, (d * 2 + 12)/10))
    return val > 1000 ? `${Math.ceil(val/1000)}k` : val
  })
const color = scaleLinear().domain([0, 127, 255]).range(['lawngreen ', 'gold', 'orangered'])

chartGroup.append('g')
  .attr('class', 'freq y')
  .call(yAxis)

chartGroup.append('g')
  .attr('class', 'freq x')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis)

const render = () => {
  requestAnimationFrame(render);

  // Copy frequency data to frequencyData array.
  analyser.getByteFrequencyData(frequencyData);

  // Update d3 chart with new data.
  svg.selectAll('rect')
    .data(frequencyData)
    .attr('y', d => height - y(d))
    .attr('height', d => y(d))
    .attr('fill', color); //`rgb(255, ${255-d}, 0)`
}

export default render