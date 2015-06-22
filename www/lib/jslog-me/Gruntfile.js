/*jslint white: true*/
/*global module, grunt*/
module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt,{
      pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
  });

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
          all: ['Gruntfile.js', 'lib/*.js', 'test/**/*.js']
      },
      uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            sourceMap: true
          },
          build: {
            src: 'lib/<%= pkg.name %>.js',
            dest: 'dist/<%= pkg.name %>.min.js'
          }
      },
      jasmine: {
          main: {
              src: 'test/**/*.js',
              options: {
                  helpers: ['lib/jslog.js', 'lib/vendor/lodash.min.js']
              }
          }
      }
  });

  // Default task(s).
  grunt.registerTask('default', ['travis-lint', 'jshint', 'uglify']);
  grunt.registerTask('check', ['travis-lint', 'jshint']);
  grunt.registerTask('test', ['jshint', 'jasmine:main']);

};
