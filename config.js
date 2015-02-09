module.exports = {
    splitChars : /[.,;!:() _+\-\[\]]/,
    separator : ' ',
    filesToParse : '([^\s]+(\.(?i)(mkv|m4v|avi|mp4|srt))$)',
    capitaliseFirstLetter : true,
    parseYear : true,
    parseEpisode: true,
    ignoreWords : [
        '','480p','720p','1080p',
        'ITA','ENG','Subs','Sub','iTALiAN','jap','ENGLiSH',
        'hdtv','BluRay','DLMux','BDMux','BRMux','DVDRip','BrRip','BdRip','x264','x265','h264','h265','xvid','MP4',
        'AC3','Mp3','aac','2CH','DTS','Dts',
        // releaser
        'TrTd_Team','HEVC','kh','iGM','GiuseppeTnT','Marco','lol','SToNeD','AlgernonWood','NovaRip','Pir8','KILLERS','ZMachine','byR02','DarkSideMux','TeRRa','FoV','IGM','SATOSHi','TLA','RiVER','oRo'
    ]
};


