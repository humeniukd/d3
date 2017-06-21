//db Math.log(parseFloat(x))/Math.LN10)*20
let ac;
prepare = (file) => new Promise((resolve, reject) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  AudioContext || reject()
  ac = new AudioContext
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

document.getElementById('input').addEventListener('change', (e) => {
  prepare(e.target.files[0]).then((source) => {
    const {duration, sampleRate} = source.buffer;

    const height = 200;
    const width = 1200;
    let svg, prevPosition = 0;

    const margin = {left: 50, right: 50, top: 40, bottom: 0};

    const worker = new Worker('w.js');
    worker.postMessage(source.buffer.getChannelData(0));
    worker.onmessage = (e) => {
      const {data} = e;
      const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

      const y1 = d3.scaleLinear()
        .domain([-120, 0])
        .range([height, 0]);

      const yAxis = d3.axisLeft(y).ticks(3).tickPadding(10).tickSize(10);
      //const xAxis = d3.axisBottom(x);

      const area = d3.area()
        .x((d, i) => i)
        .y0(height)
        .y1(d => y(d));

      const area1 = d3.area()
        .x((d, i) => i)
        .y0(height)
        .y1(d => {
          let db = -120;
          if (d > 0)
            db = Math.log(d) / Math.LN10 * 20
          return y1(db)
        });
      svg = d3.select('body').append('svg').attr('height', '100%').attr('width', '100%');
      const svgDefs = svg.append('defs');
      const gradient = svgDefs.append('linearGradient').attr('id', 'linear')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('stop-color', '#000')
        .attr('offset', '1%');

      gradient.append('stop')
        .attr('stop-color', '#0a5')
        .attr('offset', '1%');

      const chartGroup = svg.append('g').attr('transform', `translate('${margin.left}',${margin.top}')`);

      chartGroup.append('path').attr('d', area1(data)).attr('fill', 'url(#linear)').on('click', (e) => console.log(this, e));
      chartGroup.append('path').attr('d', area(data));

      chartGroup.append('g')
        .attr('class', 'axis y')
        .call(yAxis);
      chartGroup.append('g')
        .attr('class', 'axis x')
        .attr('transform', `translate(0,${height})`)
      //.call(xAxis);
      progress = () => {
        if (prevPosition !== source.context.currentTime) {
          prevPosition = source.context.currentTime
          gradient.attr('x1', `${100 * source.context.currentTime / duration}%`);
        }
      };
      setInterval(progress, 10)
    };
    source.start(0);
  })
  // const y = d3.scaleLinear().domain([]).range();
});