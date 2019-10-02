const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const reduceKeyToValue = (acc, value, i) => ({
  ...acc,
  [i]: value,
})

const stringToArray = (string) => {
  return [...string]
}

const validateSeries = (seriesArray) => {
  const dupe = seriesArray.find((x, i, all) => all.indexOf(x) !== i)

  if (dupe) {
    throw new Error(`duplicate value "${dupe}" in series`)
  }
}

const getEncoderForSeries = (seriesArray) => {
  validateSeries(seriesArray)
  const values = seriesArray.reduce(reduceKeyToValue, {})
  return function encoder(int) {
    if (isNaN(int)) {
      throw new Error(`Invalid int: ${int}`)
    }
    const base = seriesArray.length
    if (int < base) {
      return values[int]
    } else {
      const left = encoder(Math.floor(int / base))
      const right = encoder(int % base)
      return `${left}${right}`
    }
  }
}

const getSeriesEncoder = (series) => {
  const seriesArray = stringToArray(series)
  const encoder = getEncoderForSeries(seriesArray)
  encoder.radix = seriesArray.length
  encoder.series = series
  return encoder
}

const getDecoderReducerForSeries = (seriesArray) => (acc, value, i) => {
  const positionFactor = Math.pow(seriesArray.length, i)
  return acc + (seriesArray.indexOf(value) * positionFactor)
}

const getSeriesDecoder = (series) => {
  const seriesArray = stringToArray(series)
  const reducer = getDecoderReducerForSeries(seriesArray)
  return (encoded) => stringToArray(encoded)
    .reverse()
    .reduce(reducer, 0)
}

const toBase62 = getSeriesEncoder(CHARS)
const fromBase62 = getSeriesDecoder(CHARS)

module.exports = {
  fromInt: toBase62,
  getSeriesDecoder,
  getSeriesEncoder,
  toInt: fromBase62,
}
