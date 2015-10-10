#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function removeScriptIndex(indexPath, platform) {
  try {

    var html = fs.readFileSync(indexPath, 'utf8');

    html = html.replace('<script src="js/browser.js"></script>', '');

    fs.writeFileSync(indexPath, html, 'utf8');

    process.stdout.write('Remove Script index \n');
  } catch (e) {
    process.stdout.write(e);
  }
}


if (rootdir) {

  // go through each of the platform directories that have been prepared
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

  for(var x=0; x<platforms.length; x++) {
    // open up the index.html file at the www root
    try {
      var platform = platforms[x].trim().toLowerCase();
      var indexPath;

      if(platform == 'android') {
        indexPath = path.join('platforms', platform, 'assets', 'www', 'index.html');
      } else {
        indexPath = path.join('platforms', platform, 'www', 'index.html');
      }
      if(fs.existsSync(indexPath)) {

        removeScriptIndex(indexPath, platform);
      }

    } catch(e) {
      process.stdout.write(e);
    }
  }

}
