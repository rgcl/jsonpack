/*
 Copyright (c) 2013, Rodrigo González, Sapienlab All Rights Reserved.
 Available via MIT LICENSE. See https://github.com/roro89/jsonpack/blob/master/LICENSE.md for details.
 */
'use strict';

describe('jsonpack', function() {
    
    var assert = require('assert'),
        expect = require('expect.js'),
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
            expect(jsonpack).to.be.an("object");
        });

        it('has JSON property', function() {
            expect(jsonpack.JSON).to.be.an("object");
        });

        it('has pack method', function() {
            expect(jsonpack.pack).to.be.a("function");
        });

        it('has unpack method', function() {
            expect(jsonpack.unpack).to.be.a("function");
        });

    });

    describe('pack', function() {

        it('empty object', function() {
            expect(jsonpack.pack({})).to.eql("^^^$]");
        });

        it('empty array', function() {
            expect(jsonpack.pack([])).to.eql("^^^@]");
        });

        it('plain object', function() {
            expect(jsonpack.pack(plainObject)).to.eql(plainObjectPacked);
        });

        it('deep object', function() {
            expect(jsonpack.pack(deepObject)).to.eql(deepObjectPacked);
        });

        it('complex array object', function() {
            expect(jsonpack.pack(arrayObject)).to.eql(arrayObjectPacked);
        });

    });

    describe('unpack', function() {

        it('empty object', function() {
            expect(jsonpack.unpack("^^^$]")).to.eql({});
        });

        it('empty array', function() {
            expect(jsonpack.unpack("^^^@]")).to.eql([]);
        });

        it('plain object', function() {
            expect(jsonpack.unpack(plainObjectPacked)).to.eql(plainObject);
        });

        it('deep object', function() {
            expect(jsonpack.unpack(deepObjectPacked)).to.eql(deepObject);
        });

        it('complex array object', function() {
            expect(jsonpack.unpack(arrayObjectPacked)).to.eql(arrayObject);
        });

    });

});
