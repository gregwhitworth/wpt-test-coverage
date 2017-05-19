#!/usr/bin/env node
/*
 * WPT-Test-Coverage
 * https://github.com/gregwhitworth/wpt-test-coverage
 *
 * Copyright (c) 2017 Greg Whitworth
 * Licensed under the MIT license.
 */

  'use strict';

  var fs = require('fs');
  var path = require('path');
  var request = require('request');
  var cheerio = require('cheerio');
  const Url = require('url');
  var myArgs = require('optimist').argv;
  var glob = require('glob');
  var _ = require('lodash');

  var filePath = myArgs.f.trim();
  var tr = myArgs.t.trim();

  var files = glob.sync('**/*.{html,htm,xht,xhtml}', { 'cwd': filePath, 'realpath': true, 'nodir': true });
  var results = new Array();
  var anchors = new Array();
  var testWrongLink = new Array();
  var coverage = wptcoverage();

  function wptcoverage() {
    return Promise.all(files.map(getHelpLink))
                  .then(function() {
                    return getPossibleAnchors();
                  })
                  .then(function() {
                    return brokenTestAnchors();
                  })
                  .then(function() {
                    printResults();
                  });
  }

  /*
    Get Possible Anchors
    -------------------------------
    This will fetch the public URL TR file and
    create an anchor array based on the TOC.
  */
  function getPossibleAnchors() {
      return new Promise(function(fulfill, reject) {
        if(tr == ("" || null || undefined)) reject("No TR provided");

        request({uri: tr}, function(error, response, body) {
          var $ = cheerio.load(body);

          getSpecTextAnchors($);

          return fulfill(anchors);
        });
      });
  }

  function getSpecTextAnchors($) {
    return new Promise(function(fulfill, reject) {
      var specAnchors = $('main [id], main [name]');

      for (var key in specAnchors) {
        if (specAnchors.hasOwnProperty(key)) {
          var element = specAnchors[key];

          if(element.attribs == undefined) continue;

          if(!anchors.includes(element.attribs.id)) {
            anchors.push(element.attribs.id);
          }

          if(!anchors.includes(element.attribs.name)) {
            anchors.push(element.attribs.name);
          }
        }
      }

      return fulfill();
    });
  }

  /*
    Broken Test Anchors
    -------------------------------
    This will take the possible anchors
    and diff the found test anchors against
    those. These tests may need to be updated to
    reflect the sections.
  */
  function brokenTestAnchors() {
    return new Promise(function(fulfill, reject) {
        for (var i = 0; i < results.length; i++) {
          var normalize = results[i].name.replace("#", "");
          if(!anchors.includes(results[i].name)
             && !anchors.includes(normalize)) {
            testWrongLink.push(results[i].name);
          }
        }
        return fulfill();
      });
  }

  /*
    Print Results
    -------------------------------
    This will take the results and the possible
    anchors provided by the TOC and diff them and
    make some suggestions & also provide how many
    tests per anchor type exist.
  */
  function printResults() {
    results = _.sortBy(results, ['count']);
    console.log("Test Coverage");
    console.log("------------------");
    for(var r = 0; r < results.length; r++) {
      console.log(results[r].name + ", " + results[r].count);
    }

    if(testWrongLink.length > 0) {
      console.log(" ");
      console.log("Broken Test Anchors");
      console.log("------------------");
      for(var r = 0; r < testWrongLink.length; r++) {
        console.log(testWrongLink[r]);
      }
    }
  }

  /*
    Get Help Link
    -------------------------------
    This will open the file and find the
    link to the spec and place the hash
    in the results if it doesn't already exist.
  */
  function getHelpLink(file) {
    return new Promise(function(fulfill, reject) {
      var res = fs.readFileSync(file)
      if(res != undefined) {
        var $ = cheerio.load(res);
        var help = $('link[rel=help]').attr('href');

        if(help != undefined) {
          help = Url.parse(help);
          help = help.hash;
          var result = _.find(results, {'name': help});
          if(result) {
            result.count++;
          }
          else {
            var tmpObj = {name: help, count: 1}
            results.push(tmpObj);
          }
        }
      }

      return fulfill();
    });
  }