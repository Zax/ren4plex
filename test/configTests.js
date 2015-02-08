var assert = require("assert");
var config = require('../config');

describe('config', function(){

    describe('#splitChars', function(){

        it('should split correctly', function(){
            var testCases = [
                { in: 'a.b', out: ['a','b'] },
                { in: 'a b', out: ['a','b'] },
                { in: 'a_b', out: ['a','b'] },
                { in: 'a-b', out: ['a','b'] },
                { in: 'a;b', out: ['a','b'] },
                { in: 'a(b', out: ['a','b'] },
                { in: 'a)b', out: ['a','b'] },
                { in: 'a!b', out: ['a','b'] },
                { in: 'a[b', out: ['a','b'] },
                { in: 'a]b', out: ['a','b'] },
            ];

            for (var i = 0; i < testCases.length; i++) {
                assert.deepEqual(testCases[i].in.split(config.splitChars), testCases[i].out);
            }
        })

    })

})
