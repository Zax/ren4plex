var assert = require("assert");
var ren4plex = require('../lib/ren4plex');

describe('ren4plex', function(){

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
                    { in: 'a+b', out: ['a','b'] },
                ];

                for (var i = 0; i < testCases.length; i++) {
                    assert.deepEqual(testCases[i].in.split(ren4plex.config.splitChars), testCases[i].out);
                }
            })

        })

    })

    describe('#getExtension()', function(){

        it('file.name.mp4 -> .mp4', function(){
            assert.equal(ren4plex.getExtension('file.name.mp4'), '.mp4');
        })
    })

    describe('#getFilename()', function(){

        it('should parse name correctly', function(){

            var testCases = [
                {   in:  'A.Proposito.di.Davis.(2013).1080p.BluRay.Dts.ITA.ENG.Subs.x264.mkv',
                    out: 'A Proposito Di Davis (2013).mkv'}
                ,{  in:  'Lucy.2014.iTA-ENG.Bluray.720p.x264-TRL.mkv',
                    out: 'Lucy (2014).mkv'}
                ,{  in:  'the.originals.101.hdtv-lol.mp4',
                    out: 'The Originals s01e01.mp4'}
                ,{  in:  'Continuum.3X06.Una.Decisione.Difficile.ITA.ENG.720p.BDMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv',
                    out: 'Continuum s03e06 Una Decisione Difficile.mkv'}
                ,{  in:  '[DLMux 720p - H264 - Ita Mp3] Elementary S01e01.by.IperB.mkv',
                    out: 'Elementary s01e01.mkv'}
                ,{  in:  'Jane.The.Virgin.S01E01.PROPER.HDTV.x264-2HD.mp4',
                    out: 'Jane The Virgin s01e01.mp4'}
                ,{  in:  'Gotham.S01E11.Rogues.Gallery.720p.WEB-DL.2CH.x265.HEVC-AlgernonWood.mkv',
                    out: 'Gotham s01e11 Rogues Gallery.mkv'}
                ,{  in:  'Marvels.Agents.of.S.H.I.E.L.D.S02E08.720p.WEB-DL.2CH.x265.AlgernonWood.mkv',
                    out: 'Marvels Agents Of S H I E L D s02e08.mkv'}
                ,{  in:  'Once.Upon.A.Time.4X07.La.Regina.Delle.Nevi.ITA.ENG.720p.WEB-DLMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv',
                    out: 'Once Upon A Time s04e07 La Regina Delle Nevi.mkv'}
                ,{  in:  'Person.of.Interest.4X03.L.Esperto.Di.Donne.ITA.ENG.720p.Web-DMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv',
                    out: 'Person Of Interest s04e03 L Esperto Di Donne.mkv'}
                ,{  in:  'Hart.of.Dixie.S04E06.HDTV.x264-LOL.mp4',
                    out: 'Hart Of Dixie s04e06.mp4'}
            ];


            for (var i = 0; i < testCases.length; i++) {
                assert.equal(ren4plex.getFilename(testCases[i].in), testCases[i].out);
            }

        })
    })

})
