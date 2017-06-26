import { ac } from './audio'
import compressor  from './compressor'
import { analyser }  from './frequency'

const nodes = [compressor, analyser, ac.destination]

export default class BufferPlayer {
  constructor(buffer, loop = true) {
    this.loop = loop
    this.mode = 0
    this.offset = 0
    this.buffer = buffer
  }
  get duration() {
    return this.buffer && this.buffer.duration
  }
  get isPlaying() {
    return this.source && this.source.playbackState
  }
  get currentTime() {
    if(this.isPlaying)
      return (ac.currentTime - this.ts + this.offset) % this.duration
    else
      return this.offset
  }
  stop() {
    this.source && this.source.stop()
    this.offset = this.currentTime
    this.source = null
  }
  pause() {
    if(this.isPlaying) {
      this.stop()
    } else {
      this.play()
    }
  }
  disconnect(){
    nodes.forEach(node => this.source.disconnect(node))
  }
  connect() {
    nodes.reduce((src, node, i) => {
      if(i >= this.mode){
        src.connect(node)
        return node
      }
      return src
    }, this.source)
  }
  prepare() {
    this.source = ac.createBufferSource()
    this.source.loop = this.loop
    this.source.buffer = this.buffer
    this.connect()
  }
  play(k = 0) {
    this.ts = ac.currentTime
    if(k){
      this.stop()
      this.offset = this.duration * k
    }
    this.prepare()
    this.source.start(0, this.offset)
  }
}