/*
 * WPT-Test-Coverage
 * https://github.com/gregwhitworth/wpt-test-coverage
 *
 * Copyright (c) 2017 Greg Whitworth
 * Licensed under the MIT license.
 */

(function(exports) {

  'use strict';

  var fs = require('fs');
  var path = require('path');
  var cheerio = require('cheerio');
  var myArgs = require('optimist').argv;
  var glob = require('glob');
  var filePath = myArgs.f;

  var files = glob.sync('**/*.{html,htm,xht,xhtml}', { 'cwd': filePath, 'realpath': true, 'nodir': true });
  var results = new Array();

  exports.wptTestCoverage = function() {
    return Promise.all(files.map(getSpecLink)); 
  }

  wptTestCoverage().then(function() {
    console.log(results);
  });

  function getHelpLink(file) {
    return new Promise(function(fulfill, reject) {
      fileToString(file).then(function(res) {
        if(res != undefined) {
          var $ = cheerio.load(res);
          var help = $('link[rel=help]').attr('href');
          if(help != undefined) {
            if(!results.includes(help)) {
              results.push(help);
            }          
          }      
        }
        return fulfill(res);
      });    
    });     
  }

  function fileToString(file) {
    return new Promise(function(fulfill, reject) {
      fs.readFile(file, function(err, res) {
        if (err) reject(err);
        else fulfill(res.toString());
      });
    });
  }

}(typeof exports === 'object' && exports || this));*/
