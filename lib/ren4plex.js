#!/usr/bin/env node

var fs = require('fs');
var pt = require('path');
var program = require('commander');
var package = require('../package.json');
var colors = require('colors/safe');
var archy = require('archy');
var async = require('async');

var ren4plex = {

    // config
    config : {
        preview: false,
        recursive: false,
        removeTitle: false,
        splitChars : /[.,;!:() _+\-\[\]]/,
        separator : ' ',
        filesToParse : /[^\s]+\.(mkv|m4v|avi|mp4|srt)$/i,
        capitaliseFirstLetter : true,
        parseYear : true,
        parseEpisode: true,
        preReplace : [
            { search: /H.265/gi, replace: '' },
            { search: /H.264/gi, replace: '' },
            { search: /Blu-Ray/gi, replace: '' },
            { search: /S.H.I.E.L.D/gi, replace: 'Shield' },
            { search: /Ac3 2.0/gi, replace: '' },
            { search: /Ac3 5.1/gi, replace: '' },
            { search: /iDN_CreW/gi, replace: '' },
            { search: /www.DivxTotaL.com/gi, replace: '' },
            { search: /Yamato Video/gi, replace: '' }
        ],
        ignoreWords : [
            '','480p','720p','1080p',
            'ITA','ENG','Subs','Sub','iTALiAN','jap','ENGLiSH','Fansub','Softsub','0sec','10bit','Encoding',
            'hdtv','BluRay','DLMux','BDMux','BRMux','DVDRip','BrRip','BdRip','x264','x265','h264','h265','xvid','MP4','WEBRIP','PROPER','WEB','DL','DMux','Mux','Rip','Dvd','Hdtvmux',
            'AC3','Mp3','aac','2CH','DTS','Dts','2HD','HD','Webmux', 'IMAX',
            // releaser
            'TrTd_Team','HEVC','kh','iGM','GiuseppeTnT','Marco','lol','SToNeD','AlgernonWood','NovaRip','Pir8','KILLERS','ZMachine','byR02','DarkSideMux','TeRRa','ORGANiC', 'ettv',
            'FoV','IGM','SATOSHi','TLA','RiVER','oRo','by','IperB','rarbg','xXTenGXx','ASAP','TRL','NAHOM','BLUWORLD','Kagome','VTV','Shiv@','QCF','Blackbit', 'Maxks', 'Ruskiyspetz','iCV','T4P3','Batv','MIRCrew',
            'Hditaly','5ys73m','Y99dr4s1l','UBi', 'Sciencefun', 'Soulwaxx', 'PirateMKV'
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
        var word = '';
        var result = '';
        var resultWithoutTitle = '';
        var year = '';
        var episode = '';
        // cycle on words (from last)
        for (i = words.length - 1; i >= 0; i--) {
            // word not on ignore list
            if (this.isIgnored(words[i])) continue;

            // check if is year
            if (this.config.parseYear && year === ''){
                var int = parseInt(words[i]);
                if (int > 1900 && int <= new Date().getFullYear()){
                    year = this.config.separator + '(' + int + ')';
                    continue;
                }
            }

            // capitalise
            word = this.config.capitaliseFirstLetter ? this.capitaliseFirstLetter(words[i]) : words[i];

            // check if episode
            if (this.config.parseEpisode && episode === ''){
                episode = this.getEpisode(word, filename);
                if (episode !== '') word = episode;
            }

            // result without title (words after episode)
            if (this.config.removeTitle && episode !== '') {
                resultWithoutTitle = word + (resultWithoutTitle.length > 0 ? this.config.separator : '') + resultWithoutTitle;
            }

            // add word to result
            result = word + (result.length > 0 ? this.config.separator : '') + result;
        }
        var name = (resultWithoutTitle === '' ? result + year : resultWithoutTitle);
        return (name.length > 0 ? name : filename) + extension;
    },

    printFileName: function (oldFile, newFile){
        if (oldFile === newFile)
            return colors.green(oldFile);
        else
            return colors.red(oldFile) + colors.grey(' -> ') + colors.green(newFile);
    },

    // Parse entire directory
    parseDir: function (path, cb){
        fs.readdir(path, function(err, files){
            if (err) {
                return cb();
            }
            var result = { label: colors.white(pt.basename(path)), nodes : [] };
            // loop on files
            async.each(files, function(file, cb){
                    var fullpath = pt.join(path,file);
                    // check if recursive and is directory
                    if (ren4plex.config.recursive && fs.lstatSync(fullpath).isDirectory()){
                        ren4plex.parseDir(fullpath, function(data){
                            if (data) result.nodes.push(data);
                            cb();
                        });
                        return;
                    }
                    // check if file name match
                    if (!ren4plex.config.filesToParse.test(file)){
                        return cb();
                    }
                    // find new name for file
                    var newName = ren4plex.getFilename(file);
                    // check new name black
                    if (!newName){
                        result.nodes.push(ren4plex.printFileName(file, '*** NEW NAME BLACK ***'));
                        return cb();
                    }
                    // check if file already exist with new name
                    if (newName.toUpperCase() !== file.toUpperCase() && fs.existsSync(pt.join(path,newName))){
                        result.nodes.push(ren4plex.printFileName(file, newName + ' *** ERROR, ALREADY EXIST ***'));
                        return cb();
                    }
                    if (ren4plex.config.preview){
                        result.nodes.push(ren4plex.printFileName(file, newName));
                        return cb();
                    }
                    // rename file
                    fs.rename(fullpath, pt.join(path,newName), function (err) {
                        if (!err)
                            result.nodes.push(ren4plex.printFileName(file, newName));
                        return cb();
                    });
                },
                function () {
                    // callback with results
                    return cb(result);
                }
            );
        });
    },

    // Start rename on path
    start: function(path, cb){
        var result = { label: colors.white('ren4plex ')
        + (ren4plex.config.preview ? colors.green('[PREVIEW MODE]') : '')
        + (ren4plex.config.recursive ? colors.green('[RECURSIVE]') : '')
        + (ren4plex.config.removeTitle ? colors.green('[REMOVE TITLE]') : '')
        };
        this.parseDir(path, function (data) {
            result.nodes = [ data ];
            cb(result);
        });
    }

};
module.exports = ren4plex;

program
    .version(package.version, '-v, --version')
    .option('-p, --preview', 'Preview mode (don\'t rename)')
    .option('-r, --recursive', 'Recurse on all sub-directories')
    .option('-t, --remove-title', 'Remove episode title')
    .usage('[options] [dir]')
    .parse(process.argv);
ren4plex.config.preview = program.preview;
ren4plex.config.recursive = program.recursive;
ren4plex.config.removeTitle = program.removeTitle;
ren4plex.start(program.args[0] ? program.args[0] : '.', function(result){
    s = archy(result);
    console.log(s);
});
