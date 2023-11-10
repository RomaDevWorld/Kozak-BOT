const timestamp = (timestamp: number | string, format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R') => {
  return `<t:${timestamp.toString().slice(0, 10)}:${format}>`
}

export default timestamp
