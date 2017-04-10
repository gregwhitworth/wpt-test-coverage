'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['wpt-test-coverage.js'],
        dest: 'dist/wpt-test-coverage.js'
      },
    },
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/wpt-test-coverage.min.js'
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify']);

};
