//db Math.log(parseFloat(x))/Math.LN10)*20

class AvgCounter {
  constructor() {
    this.average = 0,
    this.count = 0
  }
  getAverage() {
    return this.average
  }
  add(e) {
    this.average = (this.average * this.count + e) / (this.count + 1),
    this.count++
  }
  addArray(arr) {
    const sum = arr.reduce((sum, item) => sum + item),
      count = this.count + arr.length;
    this.average = (this.average * this.count + sum) / count,
    this.count = count
  }
}

prepare = (file) => new Promise((resolve, reject) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  AudioContext || reject()
  const ac = new AudioContext
  if (file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const source = ac.createBufferSource();
      return ac.decodeAudioData(e.target.result, b => {
        source.buffer = b;
        source.connect(ac.destination);
        return resolve(source)
      })
    };
  }
});

function processBuffer(audioBuffer, onDone, width = 1800, precision = 100) {
  function fn(n) {
    return () => {
      if (n >= width)
        return void onDone(result);
      const tmp = [],
        current = Math.ceil(n * data.length / width),
        next = Math.ceil((n + 1) * data.length / width),
        delta = next - current;
      if (delta > precision)
        for (let i = 0; i < precision; i++) {
          const idx = Math.floor(Math.random() * delta) + current;
          tmp.push(Math.abs(data[idx]))
        }
      else
        for (let j = current; j < next; j++) {
          const val = Math.floor(Math.abs(data[j]));
          tmp.push(val)
        }
      const avg = new AvgCounter;
      avg.addArray(tmp),
      result[n] = avg.getAverage(),
      setTimeout(fn(n + 1), 0)
    }
  }
  const data = audioBuffer.getChannelData(0), result = new Array(width);
  setTimeout(fn(0), 0)
}

document.getElementById('input').addEventListener('change', (e) => {
  prepare(e.target.files[0]).then((source) => {
    const { duration, sampleRate } = source.buffer;

    const height = 200;
    const width = 1200;

    const margin = {left:50,right:50,top:40,bottom:0};
    processBuffer(source.buffer, (data) => {
      const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

      const y1 = d3.scaleLinear()
        .domain([-120, 0])
        .range([height, 0]);

      const x = d3.scaleLinear()
        .domain([0, data.length])
        .range([width, 0]);

      const yAxis = d3.axisLeft(y).ticks(3).tickPadding(10).tickSize(10);
      const xAxis = d3.axisBottom(x);

      const area = d3.area()
        .x((d,i) => x(i))
        .y0(height)
        .y1(d => y(d));

      const area1= d3.area()
        .x((d,i) => x(i))
        .y0(height)
        .y1(d => {
          let db = -120;
          if (d > 0)
            db = Math.log(d)/Math.LN10*20
          return y1(db)
        });
      const svg = d3.select('body').append('svg').attr('height','100%').attr('width','100%');
      const chartGroup = svg.append('g').attr('transform', `translate('${margin.left}',${margin.top}')`);
      chartGroup.append('path').attr('d',area1(data)).attr('fill', '#ccc');
      chartGroup.append('path').attr('d',area(data));
      chartGroup.append('g')
        .attr('class','axis y')
        .call(yAxis);
      chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform',`translate(0,${height})`)
        .call(xAxis);
    })

    source.start(0);
  })
  // const y = d3.scaleLinear().domain([]).range();
})