'use strict';

const assert = require('assert').strict;
const jsonpack = require('../index.js');

describe('jsonpack', () => {

    const plainObject = {
        string  : 'hello',
        integer : 1989,
        float   : 1.2,
        true    : true,
        false   : false,
        null    : null
    };
    const plainObjectPacked = 'string|hello|integer|float|true|false|null^1J9^1.2^$0|1|2|7|3|8|4|-1|5|-2|6|-3]';

    const deepObject = {
        attr1 : plainObject,
        attr2 : plainObject,
        attr3 : [plainObject, plainObject]
    };
    const deepObjectPacked = 'attr1|string|hello|integer|float|true|false|null|attr2|attr3^1J9^1.2^$0|$1|2|3|A|4|B|5|-1|6|-2|7|-3]|8|$1|2|3|A|4|B|5|-1|6|-2|7|-3]|9|@$1|2|3|A|4|B|5|-1|6|-2|7|-3]|$1|2|3|A|4|B|5|-1|6|-2|7|-3]]]';

    const arrayObject = [plainObject, deepObject];
    const arrayObjectPacked = 'string|hello|integer|float|true|false|null|attr1|attr2|attr3^1J9^1.2^@$0|1|2|A|3|B|4|-1|5|-2|6|-3]|$7|$0|1|2|A|3|B|4|-1|5|-2|6|-3]|8|$0|1|2|A|3|B|4|-1|5|-2|6|-3]|9|@$0|1|2|A|3|B|4|-1|5|-2|6|-3]|$0|1|2|A|3|B|4|-1|5|-2|6|-3]]]]';

    describe('module shape', () => {
        it('exports pack function',   () => assert.equal(typeof jsonpack.pack,   'function'));
        it('exports unpack function', () => assert.equal(typeof jsonpack.unpack, 'function'));
    });

    describe('pack', () => {
        it('empty object',       () => assert.equal(jsonpack.pack({}),          '^^^$]'));
        it('empty array',        () => assert.equal(jsonpack.pack([]),           '^^^@]'));
        it('plain object',       () => assert.equal(jsonpack.pack(plainObject),  plainObjectPacked));
        it('deep object',        () => assert.equal(jsonpack.pack(deepObject),   deepObjectPacked));
        it('complex array',      () => assert.equal(jsonpack.pack(arrayObject),  arrayObjectPacked));

        it('deduplicates strings with escape characters', () => {
            const packed = jsonpack.pack({ attr1: ' ', attr2: '+' });
            assert.equal(packed, 'attr1|+|attr2|%2B^^^$0|1|2|3]');
        });

        it('round-trips Date as Date instance', () => {
            const date = new Date('2024-01-15T12:00:00.000Z');
            const result = jsonpack.unpack(jsonpack.pack({ d: date }));
            assert.ok(result.d instanceof Date, 'should be a Date instance');
            assert.equal(result.d.toISOString(), date.toISOString());
        });

        it('deduplicates repeated Date values', () => {
            const date = new Date('2024-01-15T12:00:00.000Z');
            const result = jsonpack.unpack(jsonpack.pack({ a: date, b: date }));
            assert.ok(result.a instanceof Date);
            assert.ok(result.b instanceof Date);
            assert.equal(result.a.toISOString(), result.b.toISOString());
        });

        it('round-trips Date in array', () => {
            const dates = [new Date('2024-01-01T00:00:00.000Z'), new Date('2024-06-15T12:30:00.000Z')];
            const result = jsonpack.unpack(jsonpack.pack(dates));
            assert.ok(result[0] instanceof Date);
            assert.ok(result[1] instanceof Date);
            assert.equal(result[0].toISOString(), dates[0].toISOString());
            assert.equal(result[1].toISOString(), dates[1].toISOString());
        });
    });

    describe('unpack', () => {
        it('empty object',  () => assert.deepEqual(jsonpack.unpack('^^^$]'),         {}));
        it('empty array',   () => assert.deepEqual(jsonpack.unpack('^^^@]'),         []));
        it('plain object',  () => assert.deepEqual(jsonpack.unpack(plainObjectPacked), plainObject));
        it('deep object',   () => assert.deepEqual(jsonpack.unpack(deepObjectPacked),  deepObject));
        it('complex array', () => assert.deepEqual(jsonpack.unpack(arrayObjectPacked), arrayObject));
    });

    describe('round-trip', () => {
        const roundTrip = (obj) => jsonpack.unpack(jsonpack.pack(obj));

        it('null values',       () => assert.deepEqual(roundTrip({ a: null, b: [null] }), { a: null, b: [null] }));
        it('undefined values',  () => assert.deepEqual(roundTrip({ a: undefined }), { a: undefined }));
        it('empty strings',     () => assert.deepEqual(roundTrip({ a: '', b: ['', ''] }), { a: '', b: ['', ''] }));
        it('booleans',          () => assert.deepEqual(roundTrip({ t: true, f: false }), { t: true, f: false }));
        it('nested arrays',     () => assert.deepEqual(roundTrip([[1, 2], [3, 4]]), [[1, 2], [3, 4]]));
        it('strings with special characters', () => {
            const obj = { space: 'hello world', plus: 'a+b', pipe: 'a|b', caret: 'a^b', percent: '50%' };
            assert.deepEqual(roundTrip(obj), obj);
        });
    });

});
