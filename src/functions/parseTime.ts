export default function (time: string) {
  const units: { [key: string]: number } = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  }

  const regex = /^(\d+)(\w+)$/

  const match = time.match(regex)

  if (!match) return

  const value = match[1]
  const unit = match[2]

  const multiplier = units[unit]

  if (!multiplier) return

  return parseInt(value) * multiplier
}
