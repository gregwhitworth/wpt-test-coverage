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

(function(exports) {

  'use strict';

  exports.testCoverage = function() {
    return console.log(__dirname);
  };

}(typeof exports === 'object' && exports || this));
