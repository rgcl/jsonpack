# jsonpack

[![Test](https://github.com/rgcl/jsonpack/actions/workflows/test.yml/badge.svg)](https://github.com/rgcl/jsonpack/actions/workflows/test.yml)

A compression algorithm for JSON.

jsonpack packs and unpacks JSON data using a dictionary-based encoding scheme. It can compress structured JSON to ~55% of its original size, especially effective with recursive or repetitive data (e.g. API responses, GeoJSON feeds).

## Installation

```bash
npm install jsonpack
```

## Usage

**CommonJS**
```js
const { pack, unpack } = require('jsonpack');
```

**ESM**
```js
import { pack, unpack } from 'jsonpack';
```

**Quick example**
```js
const { pack, unpack } = require('jsonpack');

const json = { type: 'world', name: 'earth', children: [{ type: 'continent', name: 'America' }] };

const packed = pack(json);
// "type|world|name|earth|children|continent|America^^^$0|1|2|3|4|@$0|5|2|6]]"

const restored = unpack(packed);
// { type: 'world', name: 'earth', children: [{ type: 'continent', name: 'America' }] }
```

## API

### `pack(json, options?)`

Packs a JSON value into a compact string.

- `json` — a JavaScript value (object, array, string, number, boolean, null) or a JSON string
- `options.verbose` — print log messages at each step (default: `false`)
- `options.debug` — return internal representation instead of string (default: `false`)

`Date` objects are serialized as ISO 8601 strings.

Returns a `string`.

### `unpack(packed, options?)`

Restores the original value from a packed string.

- `packed` — the string produced by `pack()`
- `options.verbose` — print log messages at each step (default: `false`)

Returns the original JavaScript value.

## Notes

- Pack/unpack are synchronous. For large payloads in a browser, run them in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).
- The packed format is not designed for streaming or incremental decoding.
- Requires Node.js >= 14.

## LICENCE

The MIT License (MIT)
Copyright (c) 2013 Rodrigo González, SASUD

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
