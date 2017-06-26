export const AudioContext = window.AudioContext || window.webkitAudioContext
export const ac = new AudioContext

export default (file) => new Promise((resolve, reject) => {
  AudioContext || reject()

  if (file) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = e => ac.decodeAudioData(e.target.result, resolve)
  }
})