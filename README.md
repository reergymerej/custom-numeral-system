# custom-numeral-system

Create encoder/decoder for a custom [numeral
system](https://en.wikipedia.org/wiki/Numeral_system).

## Examples

```js
import {
  getSeriesEncoder,
  getSeriesDecoder,
} from 'custom-numeral-system'

const series = 'asdf'
const encode = getSeriesEncoder(series)

encode.radix // 4
encode.series // 'asdf'
encode(42) // 'ddd'

const decode = getSeriesDecoder(series)
decode('ddd') // 42
```

Don't be afraid to get weird.
```js
const series = 'Hi, ma!'
const decode = getSeriesDecoder(series)

decode('!H') // 42

// make your own binary
getSeriesEncoder('🧐💥')(10) // '💥🧐💥🧐'
```
