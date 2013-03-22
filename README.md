# jsonpack

A JSON compression algorithm

## Introduction

jsonpack is an algorithm for pack and unpack JSON data.

It can compress to 55% of original size if the data has a recursive structure, example 
[Earthquake GeoJSON](http://earthquake.usgs.gov/earthquakes/feed/geojson/2.5/month) or 
[Twitter API](http://search.twitter.com/search.json?q=Twitter%20API&result_type=mixed). 

This lib works in Node.js and in the browsers

**Quick example**
```
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

#### jsonpack.JSON {Object}
A object that implements the JSON.parse() and JSON.stringify() members.
By default is the native JSON implemented in Ecmascript 5

### Members

#### jsonpack.pack(/*Object|string*/ json, /*[Object]*/ options)
Retrieve a packed representation of the json

** Example **
* Example 1: Node.js

```javascript
/**
 * Example in node.js, read a file with JSON content and save another file
 * with the packed representation of that JSON
 */
var jsonpack = require('jsonpack/main'),
    fs       = require('fs');
    
// read a file called myBigJSON.json and execute with 
// jsonContent as the content of the file
fs.readFile('../data/bigData.json', 'utf8', function(error, jsonContent) {
    
    // packed now is a string with the packed version of jsonContent
    var packed = jsonpack.pack(jsonContent);
    
    // save the packed in a file
    fs.writeFile('../data/packedjson', packed);
    
});
```

* Example 2: Browser/Node.js with AMD

```javasctipt
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
 
 // print:
 // "type|world|name|earth|children|continent|America|country|Chile|commune|Antofagasta|Europe^^^$0|1|2|3|4|@$0|5|2|6|4|@$0|7|2|8|4|@$0|9|2|A]]]]]|$0|5|2|B]]]"
 console.log(packed);
 
</script>
```

** Parameters **
* json {Object|string}: A valid JSON Object or their string representation
* parameters {[Object]}: A optional object
* parameters.verbose {[boolean=false]}: If is true, print a message step with step to the console when is packing
* parameters.debug {[boolean=false]}: If is true, return a object with the internal representation of the
                                      parser dictionary and the AST

** Returns:** 
* string: the packed string representation of the data
* object: if parameters.debug is true

#### jsonpack.unpack(/* string */ packed, /* [Object] */ options)

Unpack the data in the *packed* parameter

** Examples: **

Example 1: Node.js

```javascript
/**
 * Example in node.js, read a file with packed content and save another file
 * with the string representation of the original JSON
 */
var jsonpack = require('jsonpack/main'),
    fs       = require('fs');
    
// read a file called packedjson and execute with 
// packed as the content of the file
fs.readFile('../data/packedjson', 'utf8', function(error, packed) {
    
    // json now is a clone of the original JSON
    var json = jsonpack.pack(jsonContent);
    
    // save the JSON in a file. 
    // json is a Javascript Object, so must be stringifed
    fs.writeFile('../data/packedjson', JSON.stringify(json));
    
});
```

* Example 2: Browser/Node.js with AMD

```javasctipt
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

** Parameters **
* packed {string} : The result of call jsonpack.packed(...)
* options {[Object]}: Optional object
* options.verbose {[boolean]}: If is true print step to step message in the console  

** Return: ** Object, the clone of the original JSON

## FAQ
### This lib is stable?
Yes, was tested in Node.js, Chrome and Firefox.

### How to contribute?
I is not a native English speaker, so create a issue or better a pull request for all of my grammatical errors :)
As well, if you have a code issue or suggestion, create a issue, Thanks!

### Wath about the icon?
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