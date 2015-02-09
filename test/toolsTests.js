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
                {   in:  'A.Proposito.di.Davis.(2013).1080p.BluRay.Dts.ITA.ENG.Subs.x264.mkv',
                    out: 'A Proposito Di Davis (2013).mkv'}
                ,{  in:  'the.originals.101.hdtv-lol.mp4',
                    out: 'The Originals s01e01.mp4'}
                ,{  in:  'Continuum.3X06.Una.Decisione.Difficile.ITA.ENG.720p.BDMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv',
                    out: 'Continuum s03e06 Una Decisione Difficile.mkv'}
                ,{  in:  '[DLMux 720p - H264 - Ita Mp3] Elementary S01e01.by.IperB.mkv',
                    out: 'Elementary s01e01.mkv'}
                ,{  in:  'Jane.The.Virgin.S01E01.PROPER.HDTV.x264-2HD.mp4',
                    out: 'Jane The Virgin s01e01.mp4'}
            ];

            for (var i = 0; i < testCases.length; i++) {
                assert.equal(tools.parseFilename(testCases[i].in), testCases[i].out);
            }

        })
    })

})
