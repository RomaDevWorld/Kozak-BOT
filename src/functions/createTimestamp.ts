/**
 * Formats a timestamp using Discord's timestamp format.
 *
 * @param {number|string} timestamp - The unix timestamp to format
 * @param {'t' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'} [format='t'] - The format to use for the timestamp.
 *   - 't': Short time format (09:01)
 *   - 'T': Long time format (09:01:00)
 *   - 'd': Short date format (28/11/2018)
 *   - 'D': Long date format (28 November 2018)
 *   - 'f': Short date and time format (28 November 2018 09:01)
 *   - 'F': Long date and time format (Wednesday, 28 November 2018 09:01)
 *   - 'R': Relative time format (3 years ago)
 *
 * @returns {string} The formatted timestamp string.
 */
const timestamp = (timestamp: number | string, format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R') => {
  return `<t:${timestamp.toString().slice(0, 10)}:${format}>`
}

export default timestamp
