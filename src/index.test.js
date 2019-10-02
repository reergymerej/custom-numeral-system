import { getSeriesEncoder, getSeriesDecoder } from './'
import * as mod from './'
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

describe('fromInt', () => {
  const cases = [
    [ 1, '1' ],
    [ 10, 'a' ],
    [ 11, 'b' ],
    [ 36, 'A' ],
    [ 61, 'Z' ],
    [ 62, '10' ],
    [ 63, '11' ],
    [ 124, '20' ],
    [ 125, '21' ],
    [ 619, '9Z' ],
    [ 620, 'a0' ],
  ]

  it.each(cases)('should convert %i to %s', (int, expected) => {
    expect(mod.fromInt(int)).toBe(expected)
  })

  it.each(cases)('should convert to %i from %s', (expected, string) => {
    expect(mod.toInt(string)).toBe(expected)
  })

  it('should throw for missing int', () => {
    expect(() => {
      mod.fromInt()
    }).toThrow('Invalid int')
  })
})

describe('getSeriesEncoder', () => {
  it('should reveal its radix', () => {
    const encoder = getSeriesEncoder('asdf')
    expect(encoder.radix).toBe(4)
  })

  it('should work', () => {
    const encode = getSeriesEncoder('asdf')
    expect(encode(42)).toBe('ddd')
  })

  it('should reveal its series', () => {
    const series = 'asdfqwer1234-xy'
    const encoder = mod.getSeriesEncoder(series)
    expect(encoder.series).toBe(series)
  })

  it('should handle base62', () => {
    const series = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const encoder = mod.getSeriesEncoder(series)
    expect(encoder.radix).toBe(62)
    expect(encoder(620)).toBe('a0')
  })

  describe('012abc', () => {
    const encoder = mod.getSeriesEncoder('012abc')
    it.each`
      int | expected
      ${0}  | ${'0'}
      ${1}  | ${'1'}
      ${2}  | ${'2'}
      ${3}  | ${'a'}
      ${4}  | ${'b'}
      ${5}  | ${'c'}
      ${6}  | ${'10'}
    `('returns $expected for $int', ({ int, expected }) => {
      expect(encoder(int)).toBe(expected)
    })
  })

  describe('abc987', () => {
    const encoder = mod.getSeriesEncoder('abc987')
    it.each`
      int | expected
      ${0}  | ${'a'}
      ${1}  | ${'b'}
      ${2}  | ${'c'}
      ${3}  | ${'9'}
      ${4}  | ${'8'}
      ${5}  | ${'7'}
      ${6}  | ${'ba'}
    `('returns $expected for $int', ({ int, expected }) => {
      expect(encoder(int)).toBe(expected)
    })
  })
})

describe('getSeriesDecoder', () => {
  const decoder = mod.getSeriesDecoder(CHARS)
  const cases = [
    [ 1, '1' ],
    [ 10, 'a' ],
    [ 11, 'b' ],
    [ 36, 'A' ],
    [ 61, 'Z' ],
    [ 62, '10' ],
    [ 63, '11' ],
    [ 124, '20' ],
    [ 125, '21' ],
    [ 619, '9Z' ],
    [ 620, 'a0' ],
  ]
  it.each(cases)('should convert to %d from %s', (expected, string) => {
    expect(decoder(string)).toBe(expected)
  })
})

describe('getSeriesDecoder hex', () => {
  const decode = getSeriesDecoder(CHARS.substr(0, 16))
  const cases = [
    [ 1, '1' ],
    [ 10, 'a' ],
    [ 17, '11' ],
  ]
  it.each(cases)('should convert to %d from %s', (expected, string) => {
    expect(decode(string)).toBe(expected)
  })
})

describe('under 10', () => {
  const series = 'asdf'
  const encode = getSeriesEncoder(series)
  const decode = getSeriesDecoder(series)

  it.each`
    int | string
    ${0} | ${'a'}
    ${1} | ${'s'}
    ${2} | ${'d'}
    ${3} | ${'f'}
    ${4} | ${'sa'}
    ${5} | ${'ss'}
    ${6} | ${'sd'}
    ${7} | ${'sf'}
    ${8} | ${'da'}
    ${9} | ${'ds'}
    ${10} | ${'dd'}
    ${11} | ${'df'}
    ${12} | ${'fa'}
    ${13} | ${'fs'}
    ${14} | ${'fd'}
    ${15} | ${'ff'}
    ${16} | ${'saa'}
  `('encode', ({ int, string }) => {
    expect(encode(int)).toBe(string)
    expect(decode(string)).toBe(int)
  })
})

describe('Hi, ma!', () => {
  const series = 'Hi, ma!'
  const encode = getSeriesEncoder(series)
  const decode = getSeriesDecoder(series)

  it.each`
    int | string
    ${0} | ${'H'}
    ${1} | ${'i'}
    ${2} | ${','}
    ${3} | ${' '}
    ${42} | ${'!H'}
  `('encode', ({ int, string }) => {
    expect(encode(int)).toBe(string)
    expect(decode(string)).toBe(int)
  })
})

describe('🧐💥', () => {
  const series = '🧐💥'
  const encode = getSeriesEncoder(series)
  const decode = getSeriesDecoder(series)

  it.each`
    int | string
    ${0} | ${'🧐'}
    ${1} | ${'💥'}
    ${10} | ${'💥🧐💥🧐'}
  `('encode/decode', ({ int, string }) => {
    expect(encode(int)).toBe(string)
    expect(decode(string)).toBe(int)
  })

  it('should have the right radix', () => {
    expect(encode.radix).toBe(2)
  })
})

it('should throw for duplicates', () => {
  expect(() => {
    getSeriesEncoder('yellow')
  }).toThrow('duplicate')
})
