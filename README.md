# jsonpack

A JSON compression algorithm.

## Introduction

jsonpack is an algorithm for pack and unpack JSON data.
It can compress to 55% of original size if the data has a tree structure, example 
(http://earthquake.usgs.gov/earthquakes/feed/geojson/2.5/month)[Earthquake GeoJSON] or 
(http://search.twitter.com/search.json?q=Twitter%20API&result_type=mixed)[Twitter Query API]. 

This lib is for the Web and node.js

```
// If you have a big json
var json = {...}

// Then, pack that 
var packed = jsonpack.pack(json);

...

// And then unpack that
var json = jsonpack.unpack(packed);
```

TODO: Improve the docs

## LICENCE

Copyright (c) 2013 Rodrigo González, Sapienlab

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
