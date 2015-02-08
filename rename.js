String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};

var fs = require('fs')
var tools = require('./tools');


function parseDir(path, preview){
    fs.readdir(path, function(err, files){
        if (err) return;
        console.log('rename files on ' + path + (preview ? ' [PREVIEW MODE]' : ''));

        // loop sui files
        files.forEach(function(file){
            var ext = tools.getExtension(file);
            if (ext != '.mkv' && ext != '.m4v' && ext != '.avi' && ext != '.mp4' && ext != '.srt')return;
            var newName = tools.parseFilename(file);
            if (preview){
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

parseDir(process.argv[2] ? process.argv[2] : '.', process.argv[3]);
