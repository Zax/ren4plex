var assert = require("assert");
var tools = require('../tools');

describe('tools', function(){

    describe('#getExtension()', function(){

        it('file.name.mp4 -> .mp4', function(){
            assert.equal(
                tools.getExtension('file.name.mp4'),
                '.mp4');
        })
    })

    describe('#parseFilename()', function(){

        it('should parse name correctly', function(){

            var testCases = [
                {
                    in:  'A.Proposito.di.Davis.(2013).1080p.BluRay.Dts.ITA.ENG.Subs.x264.mkv',
                    out: 'A Proposito Di Davis (2013).mkv'
                },
                {
                    in:  'the.originals.211.hdtv-lol.mp4',
                    out: 'The Originals s02e11.mp4'
                },
                {
                    in:  'Continuum.3X06.Una.Decisione.Difficile.ITA.ENG.720p.BDMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv',
                    out: 'Continuum s03e06 Una Decisione Difficile.mkv'
                }
            ];
            for (var i = 0; i < testCases.length; i++) {
                assert.equal(tools.parseFilename(testCases[i].in), testCases[i].out);
            }

        })
    })

})
