[![Build Status](https://travis-ci.org/Zax/ren4plex.svg?branch=master)](https://travis-ci.org/Zax/ren4plex)

# ren4plex - Rename for Plex
Script Node.js for rename films and series episodes, following plex directives.

### Install
npm install ren4plex -g

### Usage

`ren4plex [options] [path]`

 Options:

    -h, --help      output usage information
    -v, --version   output the version number
    -p, --preview   Preview mode (don't rename)
    -r, --recursive Recurse on all sub-directories

### Renamed Examples

#### Films
* A.Proposito.di.Davis.(2013).1080p.BluRay.Dts.ITA.ENG.Subs.x264.mkv -> A Proposito Di Davis (2013).mkv
* Lucy.2014.iTA-ENG.Bluray.720p.x264-TRL.mkv -> Lucy (2014).mkv
* Boxtrolls-Le.Scatole.Magiche.2014.DTS.ITA.ENG.1080p.BluRay.x264-BLUWORLD.mkv -> Boxtrolls Le Scatole Magiche (2014).mkv

#### Series
* the.originals.101.hdtv-lol.mp4 -> The Originals s01e01.mp4
* Continuum.3X06.Una.Decisione.Difficile.ITA.ENG.720p.BDMux.x265.HEVC-iGM+GiuseppeTnT+Marco_kh.mkv -> Continuum s03e06 Una Decisione Difficile.mkv
* [DLMux 720p - H264 - Ita Mp3] Elementary S01e01.by.IperB.mkv -> Elementary s01e01.mkv
* Jane.The.Virgin.S01E01.PROPER.HDTV.x264-2HD.mp4 -> Jane The Virgin s01e01.mp4

![Alt text](/screenshot.jpg?raw=true "Screenshot")

