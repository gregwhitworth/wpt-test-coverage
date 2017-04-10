/*
 * WPT-Test-Coverage
 * https://github.com/gregwhitworth/wpt-test-coverage
 *
 * Copyright (c) 2017 Greg Whitworth
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var myArgs = require('optimist').argv;
var filePath = myArgs.f;
var fileUtil = require('file');
var extensions = ['.html', '.htm', '.xht'];

console.log(filePath);

/*(function(exports) {

  'use strict';

  exports.testCoverage = function() {
    return console.log(__dirname);
  };

}(typeof exports === 'object' && exports || this));*/

var files = fileUtil.walk(filePath);

function getSpecLink(file, results) {
   var content = fileToString(file);
   var $ = cheerio.load(content);
   var help = $('meta[rel=help').attr('href');
   console.log(help);
   results.push(help);
}

function fileToString(file) {
  fs.readFile(file, function(err, data) {
      if(err) throw err;
      return data.toString();
  });
}
