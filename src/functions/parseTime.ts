export default function (time: string): number {
  const units: { [key: string]: number } = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  }

  const regex = /^(\d+)(\w+)$/

  const match = time.match(regex)

  if (!match) return NaN

  const [, value, unit] = match
  const multiplier = units[unit]

  if (!multiplier) return NaN

  return parseInt(value) * multiplier
}
