[![Build Status](https://secure.travis-ci.org/sapienlab/jsonpack.png)](http://travis-ci.org/sapienlab/jsonpack)
# jsonpack <img src=https://raw.githubusercontent.com/sapienlab/jsonpack/master/icon.png alt="icon for jsonpack compressor">

A compression algorithm for JSON

## Introduction

jsonpack is a JavaScript program to pack and unpack JSON data.

It can compress to 55% of original size if the data has a recursive structure, example 
[Earthquake GeoJSON](http://earthquake.usgs.gov/earthquakes/feed/geojson/2.5/month) or 
[Twitter API](http://search.twitter.com/search.json?q=Twitter%20API&result_type=mixed). 

This lib works in both Node.js and browsers (older browsers missing [ES5's JSON.stringify](http://caniuse.com/json) support will need a [shim](http://bestiejs.github.io/json3/)).

**Quick example**
```javascript
// big JSON
var json = {...}

// pack the big JSON 
var packed = jsonpack.pack(json);

// do stuff...

// And then unpack the packed
var json = jsonpack.unpack(packed);
```

## Installation

**jsonpack** can be installed via [cpm][cpm], [volo][volo] or [npm][npm], or simply [downloaded][download].

Via cpm:

```bash
$ cpm install jsonpack
```

Via volo:

```bash
$ volo add sapienlab/jsonpack
```

Via npm:

```bash
$ npm install jsonpack
```

## API

### Atributes

#### jsonpack.JSON
A object that implements the JSON.parse() and JSON.stringify() members.
By default is the native JSON implemented in ECMAscript 5.

### Members

#### jsonpack.pack(json, options)
Retrieve a packed representation of the json

** Parameters **

* json {Object|string}: A valid JSON Object or their string representation
* parameters {[Object]}: A optional object
	* verbose (devault is false): If is true, print a log message to the console at each step of packing
		* example: `jsonpack.pack(json, { verbose: true });` packs with verbose only
	* debug {[boolean=false]}: If is true, return a object with the internal representation of the
                             parser dictionary and the AST
		* example: `jsonpack.pack(json, { debug: true });` packs with debug only

** Returns:** 

* string: the packed string representation of the data
* object: if parameters.debug is true

##### Examples

* Example 1: Node.js

```javascript
// Example in node.js, read a file with JSON content and save another file
// with the packed representation of that JSON
var jsonpack = require('jsonpack/main'),
    fs       = require('fs');
    
// read a file called myBigJSON.json and execute with 
// jsonContent as the content of the file
fs.readFile('../data/bigData.json', 'utf8', function(error, jsonContent) {
    
    // packed now is a string with the packed version of jsonContent
    var packed = jsonpack.pack(jsonContent);
    
    // save the packed in a file
    fs.writeFile('../data/packed.txt', packed);
    
});
```

* Example 2: Browser/Node.js with AMD

```javascript
require(['jsonpack', 'text!../data/bigData.json'], function(jsonpack, jsonContent) {

	// packed the data
	var packed = jsonpack.pack(jsonContent);
	
	// Do stuff with the packed string
    console.log(packed);
});
```

* Example 3: Browser

```html
<script src="path/to/jsonpack/main.js" />
<script>
 var json = {
 	type : 'world',
 	name: 'earth',
 	children: [{
 		type: 'continent',
 		name: 'America',
 		children: [{
 			type : 'country',
 			name : 'Chile',
 			children: [{
 				type : 'commune',
 				name : 'Antofagasta'
 			}]
 		}]
 	}, {
 		type: 'continent',
 		name : 'Europe'
 	}]
 };
 	
 var packed = jsonpack.pack(json);
 
 console.log(packed);
 // print:
 // "type|world|name|earth|children|continent|America|country|Chile|commune|Antofagasta|Europe^^^$0|1|2|3|4|@$0|5|2|6|4|@$0|7|2|8|4|@$0|9|2|A]]]]]|$0|5|2|B]]]"

 
</script>
```

#### jsonpack.unpack(packed, options)

Unpack the data in the *packed* parameter

** Parameters **

* packed {string} : The result of call jsonpack.packed(...)
* options {[Object]}: Optional object
	* verbose (default: false) print a log message to the console at each step of packing  

** Return: ** Object, the clone of the original JSON

##### Examples

* Example 1: Node.js

```javascript
// Example in node.js, read a file with packed content and save another file
// with the string representation of the original JSON
var jsonpack = require('jsonpack/main'),
    fs       = require('fs');
    
// read a file called packedjson and execute with 
// packed as the content of the file
fs.readFile('../data/packed.txt', 'utf8', function(error, packed) {
    
    // data now is a JavaScript Object of the original JSON
    var data = jsonpack.unpack(jsonContent);
    
    // save the JSON in a file. data is a Javascript Object, so must be
    // stringifed (and pretty print the JSON with 2 space indents).
    fs.writeFile('../data/unpacked.json', JSON.stringify(data, null, 2));
    
});
```

* Example 2: Browser/Node.js with AMD

```javascript
require(['jsonpack', 'text!../data/packed'], function(jsonpack, packed) {

	// unpacked the data
	// json now is a clone of the original JSON
	var json = jsonpack.unpack(packed);
	
	// Do stuff with the JavaScript object
    console.log(json);
});

```

* Example 3: Browser

```html
<script src="path/to/jsonpack/main.js" />
<script>
 var packed = "type|world|name|earth|children|continent|America|country|Chile|commune|Antofagasta|Europe^^^$0|1|2|3|4|@$0|5|2|6|4|@$0|7|2|8|4|@$0|9|2|A]]]]]|$0|5|2|B]]]" 

 // unpack the packed to a clone of the original JSON 	
 var json = jsonpack.unpack(packed);
 
 console.log(json);
 
</script>
```

## FAQ
### This library is stable?
Yes, was tested in Node.js, Chrome and Firefox.

### How to contribute?
I'm not a native English speaker, so create a issue or better a pull request for all of my grammatical errors :)
As well, if you have a code issue or suggestion, create a issue, Thanks!

### What about the icon?
The icon is a generic (LGPL) icon by David Vignoni - http://www.icon-king.com/

## LICENCE

The MIT License (MIT)
Copyright (c) 2013 Rodrigo González, Sapienlab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[cpm]: https://github.org/kriszyp/cpm
[volo]: http://volojs.org/
[npm]: http://npmjs.org/
[download]: https://github.com/sapienlab/jsonpack/archive/master.zip
