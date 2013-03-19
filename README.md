:: Experimental, don't use yet ::

# jsonpack

A JSON compression algorithm.

## Introduction

jsonpack is an algorithm for pack and unpack JSON data.
It can compress to 55% of original size and is not necessary
that the data uses a particular structure. 

```
// If you have a big json
var json = {...}

// Then, pack that 
var packed = jsonpack.pack(json);

...

// And then unpack that
var json = jsonpack.unpack(packed);
```