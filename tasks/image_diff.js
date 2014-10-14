/*
 * grunt-image-diff
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

  grunt.registerMultiTask('image_diff', 'Grunt implementation of Image Magick', function() {
    if (process.platform !== "win32") {
      grunt.log.warn('Only valid in windows, sorry :(.');
      return;
    }

    var options = this.options({
      orig: '_orig',
      test: '_test',
      diff: '_diff',
      highlightColor: 'red',
      fuzz: '0.0',
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
          grunt.log.warn('Test file "' + test + '" not found.');
          return;
        }
				var orig_dimensions = sizeof(orig);
				var test_dimensions = sizeof(test);
        
        tests++;

        //check if dimensions are the same between baseline and test images
				if(orig_dimensions.width != test_dimensions.width || orig_dimensions.height != test_dimensions.height) {

					var maxheight = Math.max(orig_dimensions.height, test_dimensions.height);
					var maxwidth = Math.max(orig_dimensions.width, test_dimensions.width);
					var mog_cmd = 'mogrify -extent ' + (maxwidth) + 'x' + (maxheight) + ' -gravity north -fill white ' + orig
					var result1 = shell.exec(mog_cmd, {silent:true, async:false});
					mog_cmd = 'mogrify -extent ' + (maxwidth) + 'x' + (maxheight) + ' -gravity north -fill white ' + test
					result1 = shell.exec(mog_cmd, {silent:true, async:false});
				}
			
        //user prefs  
				var cmdOptions = '';
				if (options.fuzz) {
					cmdOptions += '-fuzz "'+ options.fuzz +'%" ';
				}
				if (options.highlightColor) {
					cmdOptions += '-highlight-color '+ options.highlightColor +' ';
				}
		
        //create high contrast diff - this feels like a hack to have to run the comparison twice, but this output is ugly and the other output doesn't show % diff
				var cmd = 'compare -metric ae -fuzz "'+ options.fuzz +'%" -highlight-color white -lowlight-color black -compose src "' + orig + '" "' + test + '" "' + diff + '"'
        var triggerFail = shell.exec(cmd, {silent:true, async:false});
				//process output
        cmd = 'convert "' + diff + '" -format "%[fx:mean]" info:'
        var percentDiff = shell.exec(cmd, {silent:true, async:false});
				//create user diff
        cmd = 'compare -metric ae ' + cmdOptions + '"' + orig + '" "' + test + '" "' + diff + '"'
        triggerFail = shell.exec(cmd, {silent:true, async:false});

				//console.log(result2);
			
				var fail = triggerFail.code;

        //output
				if ( fail ) {
					grunt.log.warn('FAIL: ' + Math.round(percentDiff.output * 100) + '% difference found - see diff file ' + diff);
				} else {
      		grunt.log.ok('PASS: Diff file "' + diff + '" created');					
				}
				
      });
    });

		console.log('\n');
    if (tests > 0) {
      grunt.log.ok(tests + " tested image(s).");
    } else {
      grunt.log.warn("No tested images.");
    }

  });

};
