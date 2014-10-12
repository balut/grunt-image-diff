/*
 * grunt-image-diff-magick
 * https://github.com/eduardo.pacheco/image-diff
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var shell = require('shelljs');
var sizeof = require('image-size');

module.exports = function(grunt) {

  grunt.registerMultiTask('image_diff', 'Grunt implementation of Perceptual Image Diff with ImageMagick', function() {
    if (process.platform !== "win32") {
      grunt.log.warn('Only valid in windows, sorry :(.');
      return;
    }

    var options = this.options({
      orig: '_orig',
      test: '_test',
      diff: '_diff',
      fuzz: '0.0',
      highlight: 'red',
    });

    var tests = 0;

    this.files.forEach(function (f) {
      f.src.forEach(function(orig) {
        var test = orig.replace(options.orig, options.test);
        var diff = orig.replace(options.orig, options.diff);
        if (orig === diff) {
          return;
        }
        if (!grunt.file.exists(test)) {
          grunt.log.warn('Test file "' + test + '" invalid.');
          return;
        }
        
        tests++;

        var origDim = sizeof(orig);
        var testDim = sizeof(test);

        //ImageMagick cannot compare 2 images with different dimensions
        if( origDim.height !== testDim.height || origDim.width !== testDim.width ) {
            var maxWidth = Math.max(origDim.width, testDim.width);
            var maxHeight = Math.max(origDim.height, testDim.height);
            var resizeResult;

            resizeResult = shell.exec('mogrify -background white -gravity north -extent ' + maxWidth + 'x' + maxHeight + ' "' + orig + '"', {silent: true, async: false});
            resizeResult = shell.exec('mogrify -background white -gravity north -extent ' + maxWidth + 'x' + maxHeight + ' "' + test + '"', {silent: true, async: false});
        }

        var cmdOptions = '-highlight-color ' + options.highlight + ' ';
		if (options.fuzz) {
			cmdOptions += '-fuzz '+ options.fuzz +' ';
		}
        var cmd = 'compare -metric rmse ' + cmdOptions + '"' + orig + '" "' + test + '" "' + diff + '" ';
        var result = shell.exec(cmd, {silent:true, async:false}).output;
        
        var fail = result.code;

        if ( fail ) {
          grunt.fail.warn('FAIL: " diff file created at "' + diff + '"');
        }
      });
    });

    if (tests > 0) {
      grunt.log.ok(tests + " tested image(s).");
    } else {
      grunt.log.warn("No tested images.");
    }

  });

};
