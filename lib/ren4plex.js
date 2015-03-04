#!/usr/bin/env node

var program = require('commander');
var package = require('../package.json');

var ren4plex = {

    // config
    config : {
        preview: false,
        splitChars : /[.,;!:() _+\-\[\]]/,
        separator : ' ',
        filesToParse : /[^\s]+\.(mkv|m4v|avi|mp4|srt)$/i,
        capitaliseFirstLetter : true,
        parseYear : true,
        parseEpisode: true,
        preReplace : [
            { search: /H.265/gi, replace: '' },
            { search: /S.H.I.E.L.D/gi, replace: 'Shield' }
        ],
        ignoreWords : [
            '','480p','720p','1080p',
            'ITA','ENG','Subs','Sub','iTALiAN','jap','ENGLiSH',
            'hdtv','BluRay','DLMux','BDMux','BRMux','DVDRip','BrRip','BdRip','x264','x265','h264','h265','xvid','MP4','WEBRIP','PROPER','WEB','DL','DMux','Mux','Rip','Dvd',
            'AC3','Mp3','aac','2CH','DTS','Dts','2HD',
            // releaser
            'TrTd_Team','HEVC','kh','iGM','GiuseppeTnT','Marco','lol','SToNeD','AlgernonWood','NovaRip','Pir8','KILLERS','ZMachine','byR02','DarkSideMux','TeRRa',
            'FoV','IGM','SATOSHi','TLA','RiVER','oRo','by','IperB','rarbg','xXTenGXx','ASAP','TRL','NAHOM','BLUWORLD','Kagome','VTV'
        ]
    },

    // Capitalise the first letter
    capitaliseFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    // Extract extension from filename
    getExtension: function (filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    },

    // Extract episode string from word (if match)
    getEpisode: function (word, filename){
        var e,s;
        if (filename.indexOf('lol') > -1){
            var int = parseInt(word);
            if (int > 99 && int < 9999){
                s = Math.floor(int / 100);
                e = int - (s * 100);
                return  's' + ('0' + s).slice(-2) + 'e' + ('0' + e).slice(-2);
            }
        }
        // x format (es. 2x11, 1X07)
        var match = /\d{1,2}x\d{2}/i.exec(word);
        if (match){
            var xPos = word.toLowerCase().indexOf('x');
            s = parseInt(word.substr(0,xPos));
            e = parseInt(word.substr(xPos + 1));
            return  's' + ('0' + s).slice(-2) + 'e' + ('0' + e).slice(-2);
        }
        // s format (es. s02e11, S01E07)
        match = /s\d{2}e\d{2}/i.exec(word);
        if (match){
            s = parseInt(word.substr(1,2));
            e = parseInt(word.substr(4));
            return  's' + ('0' + s).slice(-2) + 'e' + ('0' + e).slice(-2);
        }
        return '';
    },

    // Check if the word must be ignored
    isIgnored: function (word){
        word = word.toLowerCase();
        for (var i = 0; i < this.config.ignoreWords.length; i++) {
            if (this.config.ignoreWords[i].toLowerCase() === word){
                return true;
            }
        }
        return false;
    },

    preReplace: function (text){
        var res = text;
        for (var i = 0; i < this.config.preReplace.length; i++) {
            res = res.replace(this.config.preReplace[i].search,this.config.preReplace[i].replace)
        }
        return res;
    },

    // Get new filename
    getFilename: function (filename){
        // find extension
        var i = filename.lastIndexOf('.');
        var extension = (i > -1) ? filename.substr(i) : '';
        if (i > -1) filename = filename.substr(0,i);
        // pre-replace
        filename = this.preReplace(filename);
        // split on words
        var words = filename.split(this.config.splitChars);
        var result = '';
        var year = '';
        var episode = '';
        for (i = 0; i < words.length; i++) {
            // word not on ignore list
            if (this.isIgnored(words[i])) continue;
            // check if is year
            if (this.config.parseYear){
                var int = parseInt(words[i]);
                if (int > 1900 && int <= new Date().getFullYear()){
                    year = this.config.separator + '(' + int + ')';
                    continue;
                }
            }
            // check if episode
            if (this.config.parseEpisode && episode == ''){
                episode = this.getEpisode(words[i], filename);
                if (episode != '') {
                    result += (result.length > 0 ? this.config.separator : '') + episode;
                    continue;
                }
            }
            // add word to result
            result += (result.length > 0 ? this.config.separator : '') +
            (this.config.capitaliseFirstLetter ? this.capitaliseFirstLetter(words[i]) : words[i]);
        }
        return result + year + extension;
    },

    // Parse entire directory
    parseDir: function (path){
        var fs = require('fs')
        fs.readdir(path, function(err, files){
            if (err) return;
            console.log('rename files on ' + path + (ren4plex.config.preview ? ' [PREVIEW MODE]' : ''));
            // loop on files
            files.forEach(function(file){
                // check if file name match
                if (!ren4plex.config.filesToParse.test(file))
                    return;
                var newName = ren4plex.getFilename(file);
                if (ren4plex.config.preview){
                    console.log(file + '->' + newName);
                    return;
                }
                fs.rename(path + '/' + file, path + '/' + newName, function (err) {
                    if (err) throw err;
                    console.log(file + '->' + newName);
                });
            });
        });
    }

};
module.exports = ren4plex;

program
    .version(package.version, '-v, --version')
    .option('-p, --preview', 'Preview mode (don\'t rename)')
//    .option('-r, --recursive', 'Recurse on all sub-directories')
    .usage('[options] [dir]')
    .parse(process.argv);
ren4plex.config.preview = program.preview;
ren4plex.parseDir(program.args[0] ? program.args[0] : '.');
