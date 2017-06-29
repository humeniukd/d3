import { ac } from './audio'

export const analyser = ac.createAnalyser()

const fftSize = 32
analyser.fftSize = fftSize
analyser.minDecibels = -90
analyser.maxDecibels = -10

const frequencyData = new Uint8Array(analyser.frequencyBinCount)

const render = () => {
  requestAnimationFrame(render)
  analyser.getByteFrequencyData(frequencyData)
  console.log(frequencyData)
}

export default render