const processBuffer = (data, width = 800, precision = 100) => {
  const result = new Array(width)
  for (let n = 0; n < width; n++) {
    const tmp = [],
      current = Math.ceil(n * data.length / width),
      next = Math.ceil((n + 1) * data.length / width),
      delta = next - current
    if (delta > precision)
      for (let i = 0; i < precision; i++) {
        const idx = Math.floor(Math.random() * delta) + current
        tmp.push(Math.abs(data[idx]))
      }
    else
      for (let j = current; j < next; j++) {
        const val = Math.floor(Math.abs(data[j]))
        tmp.push(val)
      }
    result[n] = tmp.reduce((sum, i) => sum + i, 0)/tmp.length
  }
  return result
}

onmessage = (e) => {
  const data = processBuffer(e.data)
  postMessage(data)
}