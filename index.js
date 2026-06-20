/*
 Copyright (c) 2013, Rodrigo González, SASUD All Rights Reserved.
 Available via MIT LICENSE. See https://github.com/rgcl/jsonpack/blob/main/LICENSE.md for details.
 */
'use strict';

const TOKEN_TRUE = -1;
const TOKEN_FALSE = -2;
const TOKEN_NULL = -3;
const TOKEN_EMPTY_STRING = -4;
const TOKEN_UNDEFINED = -5;

const _encode = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[\+ \|\^\%]/g, (a) => ({
        ' ' : '+',
        '+' : '%2B',
        '|' : '%7C',
        '^' : '%5E',
        '%' : '%25'
    })[a]);
};

const _decode = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/\+|%2B|%7C|%5E|%25/g, (a) => ({
        '+' : ' ',
        '%2B' : '+',
        '%7C' : '|',
        '%5E' : '^',
        '%25' : '%'
    })[a]);
};

const _base10To36 = (number) => Number.prototype.toString.call(number, 36).toUpperCase();
const _base36To10 = (number) => parseInt(number, 36);

const pack = (json, options = {}) => {
    const verbose = options.verbose || false;

    verbose && console.log('Normalize the JSON Object');
    json = typeof json === 'string' ? JSON.parse(json) : json;

    verbose && console.log('Creating empty dictionary');
    const dictionary = {
        strings  : {},
        integers : {},
        floats   : {},
        stringsLen  : 0,
        integersLen : 0,
        floatsLen   : 0
    };

    verbose && console.log('Creating the AST');
    const ast = (function recursiveAstBuilder(item) {
        verbose && console.log('Calling recursiveAstBuilder with ' + JSON.stringify(item));

        if (item === null) return { type: 'null', index: TOKEN_NULL };
        if (typeof item === 'undefined') return { type: 'undefined', index: TOKEN_UNDEFINED };

        // Date → ISO string (preserves type on unpack when treated as string)
        if (item instanceof Date) item = item.toISOString();

        if (Array.isArray(item)) {
            const ast = ['@'];
            for (let i = 0; i < item.length; i++) {
                ast.push(recursiveAstBuilder(item[i]));
            }
            return ast;
        }

        const type = typeof item;

        if (type === 'object') {
            const ast = ['$'];
            for (const key in item) {
                if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
                ast.push(recursiveAstBuilder(key));
                ast.push(recursiveAstBuilder(item[key]));
            }
            return ast;
        }

        if (item === '') return { type: 'empty', index: TOKEN_EMPTY_STRING };

        if (type === 'string') {
            const encoded = _encode(item);
            if (encoded in dictionary.strings) {
                return { type: 'strings', index: dictionary.strings[encoded] };
            }
            const index = dictionary.stringsLen++;
            dictionary.strings[encoded] = index;
            return { type: 'strings', index };
        }

        if (type === 'number' && item % 1 === 0) {
            const encoded = _base10To36(item);
            if (encoded in dictionary.integers) {
                return { type: 'integers', index: dictionary.integers[encoded] };
            }
            const index = dictionary.integersLen++;
            dictionary.integers[encoded] = index;
            return { type: 'integers', index };
        }

        if (type === 'number') {
            const key = String(item);
            if (key in dictionary.floats) {
                return { type: 'floats', index: dictionary.floats[key] };
            }
            const index = dictionary.floatsLen++;
            dictionary.floats[key] = index;
            return { type: 'floats', index };
        }

        if (type === 'boolean') {
            return { type: 'boolean', index: item ? TOKEN_TRUE : TOKEN_FALSE };
        }

        throw new Error('Unexpected argument of type ' + typeof item);
    })(json);

    const stringLength  = dictionary.stringsLen;
    const integerLength = dictionary.integersLen;

    verbose && console.log('Parsing the dictionary');

    const getSortedKeys = (dict, len) => {
        const arr = new Array(len);
        for (const key in dict) arr[dict[key]] = key;
        return arr;
    };

    let packed = getSortedKeys(dictionary.strings,  dictionary.stringsLen).join('|');
    packed += '^' + getSortedKeys(dictionary.integers, dictionary.integersLen).join('|');
    packed += '^' + getSortedKeys(dictionary.floats,   dictionary.floatsLen).join('|');

    verbose && console.log('Parsing the structure');

    packed += '^' + (function recursiveParser(item) {
        verbose && console.log('Calling recursiveParser with ' + JSON.stringify(item));

        if (Array.isArray(item)) {
            let packed = item[0];
            for (let i = 1; i < item.length; i++) {
                packed += recursiveParser(item[i]) + '|';
            }
            return (packed[packed.length - 1] === '|' ? packed.slice(0, -1) : packed) + ']';
        }

        const { type, index } = item;

        if (type === 'strings')   return _base10To36(index);
        if (type === 'integers')  return _base10To36(stringLength + index);
        if (type === 'floats')    return _base10To36(stringLength + integerLength + index);
        if (type === 'boolean')   return index;
        if (type === 'null')      return TOKEN_NULL;
        if (type === 'undefined') return TOKEN_UNDEFINED;
        if (type === 'empty')     return TOKEN_EMPTY_STRING;

        throw new TypeError('The item is alien!');
    })(ast);

    verbose && console.log('Ending parser');

    if (options.debug) return { dictionary, ast, packed };
    return packed;
};

const unpack = (packed, options = {}) => {
    const rawBuffers = packed.split('^');
    const dictionary = [];

    options.verbose && console.log('Building dictionary');

    let buffer = rawBuffers[0];
    if (buffer !== '') {
        buffer.split('|').forEach((s) => dictionary.push(_decode(s)));
    }

    buffer = rawBuffers[1];
    if (buffer !== '') {
        buffer.split('|').forEach((s) => dictionary.push(_base36To10(s)));
    }

    buffer = rawBuffers[2];
    if (buffer !== '') {
        buffer.split('|').forEach((s) => dictionary.push(parseFloat(s)));
    }

    options.verbose && console.log('Tokenizing the structure');

    let number36 = '';
    const tokens = [];
    const raw = rawBuffers[3];
    for (let i = 0, len = raw.length; i < len; i++) {
        const symbol = raw[i];
        if (symbol === '|' || symbol === '$' || symbol === '@' || symbol === ']') {
            if (number36) {
                tokens.push(_base36To10(number36));
                number36 = '';
            }
            if (symbol !== '|') tokens.push(symbol);
        } else {
            number36 += symbol;
        }
    }

    const tokensLength = tokens.length;
    let tokensIndex = 0;

    options.verbose && console.log('Starting recursive parser');

    return (function recursiveUnpackerParser() {
        const type = tokens[tokensIndex++];

        if (type === '@') {
            const node = [];
            for (; tokensIndex < tokensLength; tokensIndex++) {
                const value = tokens[tokensIndex];
                if (value === ']') return node;
                if (value === '@' || value === '$') {
                    node.push(recursiveUnpackerParser());
                } else {
                    switch (value) {
                        case TOKEN_TRUE:         node.push(true);      break;
                        case TOKEN_FALSE:        node.push(false);     break;
                        case TOKEN_NULL:         node.push(null);      break;
                        case TOKEN_UNDEFINED:    node.push(undefined); break;
                        case TOKEN_EMPTY_STRING: node.push('');        break;
                        default:                 node.push(dictionary[value]);
                    }
                }
            }
            return node;
        }

        if (type === '$') {
            const node = {};
            for (; tokensIndex < tokensLength; tokensIndex++) {
                let key = tokens[tokensIndex];
                if (key === ']') return node;
                key = key === TOKEN_EMPTY_STRING ? '' : dictionary[key];

                const value = tokens[++tokensIndex];
                if (value === '@' || value === '$') {
                    node[key] = recursiveUnpackerParser();
                } else {
                    switch (value) {
                        case TOKEN_TRUE:         node[key] = true;      break;
                        case TOKEN_FALSE:        node[key] = false;     break;
                        case TOKEN_NULL:         node[key] = null;      break;
                        case TOKEN_UNDEFINED:    node[key] = undefined; break;
                        case TOKEN_EMPTY_STRING: node[key] = '';        break;
                        default:                 node[key] = dictionary[value];
                    }
                }
            }
            return node;
        }

        throw new TypeError("Bad token '" + type + "' isn't a type");
    })();
};

module.exports = { pack, unpack };
