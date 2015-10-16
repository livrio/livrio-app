#!/usr/bin/env node

var fs = require('fs');
var path = require('path');


var rootdir = process.argv[2];


if (rootdir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
    for(var x=0; x<platforms.length; x++) {
        var platform = platforms[x].trim().toLowerCase();
        console.log(platform);
        if (platform == 'android') {
            var exec = require('child_process').exec,child;
            child = exec('rm -rf platforms/android/res/values-*',function(err,out) {
              console.log(out); err && console.log(err);
            });
            //var files = glob.globSync("platforms/android/res/*");
            process.stdout.write('REMOVE VALUES');
            //process.stdout.write(files);
        }
    }
}
