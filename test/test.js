/*
 Copyright (c) 2013, Rodrigo González, Sapienlab All Rights Reserved.
 Available via MIT LICENSE. See https://github.com/roro89/jsonpack/blob/master/LICENSE.md for details.
 */
'use strict';

describe('jsonpack', function() {
    
    var assert = require('assert'),
        jsonpack = require('../main.js');
    
    var plainObject = {
            "string" : "hello",
            "integer" : 1989,
            "float" : 1.2,
            "true" : true,
            "false" : false,
            "null" : null
        },
        plainObjectPacked = "string|hello|integer|float|true|false|null^1J9^1.2^$0|1|2|7|3|8|4|-1|5|-2|6|-3]";

    var deepObject = {
            attr1 : plainObject,
            attr2 : plainObject,
            attr3 : [plainObject, plainObject]
        },
        deepObjectPacked = "attr1|string|hello|integer|float|true|false|null|attr2|attr3^1J9|1J9|1J9|1J9^1.2^$0|$1|2|3|A|4|E|5|-1|6|-2|7|-3]|8|$1|2|3|B|4|E|5|-1|6|-2|7|-3]|9|@$1|2|3|C|4|E|5|-1|6|-2|7|-3]|$1|2|3|D|4|E|5|-1|6|-2|7|-3]]]";

    var arrayObject = [
            plainObject,
            deepObject
        ],
        arrayObjectPacked = "string|hello|integer|float|true|false|null|attr1|attr2|attr3^1J9|1J9|1J9|1J9|1J9^1.2^@$0|1|2|A|3|F|4|-1|5|-2|6|-3]|$7|$0|1|2|B|3|F|4|-1|5|-2|6|-3]|8|$0|1|2|C|3|F|4|-1|5|-2|6|-3]|9|@$0|1|2|D|3|F|4|-1|5|-2|6|-3]|$0|1|2|E|3|F|4|-1|5|-2|6|-3]]]]";

    describe('elemental', function() {

        it('is object', function() {
            assert.equal(typeof jsonpack, "object");
        });

        it('has JSON property', function() {
            assert.equal(typeof jsonpack.JSON, "object");
        });

        it('has pack method', function() {
            assert.equal(typeof jsonpack.pack, "function");
        });

        it('has unpack method', function() {
            assert.equal(typeof jsonpack.unpack, "function");
        });

    });

    describe('pack', function() {

        it('empty object', function() {
            assert.equal(jsonpack.pack({}), "^^^$]");
        });

        it('empty array', function() {
            assert.equal(jsonpack.pack([]), "^^^@]");
        });

        it('plain object', function() {
            assert.equal(jsonpack.pack(plainObject), plainObjectPacked);
        });

        it('deep object', function() {
            assert.equal(jsonpack.pack(deepObject), deepObjectPacked);
        });

        it('complex array object', function() {
            assert.equal(jsonpack.pack(arrayObject), arrayObjectPacked);
        });

    });

    describe('unpack', function() {

        it('empty object', function() {
            assert.equal(jsonpack.unpack("^^^$]"), {});
        });

        it('empty array', function() {
            assert.equal(jsonpack.unpack("^^^@]"), []);
        });

        it('plain object', function() {
            assert.equal(jsonpack.unpack(plainObjectPacked), plainObject);
        });

        it('deep object', function() {
            assert.equal(jsonpack.unpack(deepObjectPacked), deepObject);
        });

        it('complex array object', function() {
            assert.equal(jsonpack.unpack(arrayObjectPacked), arrayObject);
        });

    });

});
