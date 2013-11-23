'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: {
        src: ['dist/**/*']
      }
    },
    jshint: {
      // define the files to lint
      files: ['src/**/*.js']
    },
    browserify: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name%>-<%= pkg.version%>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version%> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>-<%= pkg.version%>.min.js': ['dist/<%= pkg.name%>-<%= pkg.version%>.js']
        }
      }
    },
    zip: {
      dist: {
        router: function (filepath) {
          return path.basename(filepath);
        },
        src: [
          'README.md',
          'LICENSE',
          'dist/<%= pkg.name %>-<%= pkg.version%>.js',
          'dist/<%= pkg.name %>-<%= pkg.version%>.min.js',
          'dist/<%= pkg.name %>-<%= pkg.version%>.css',
          'dist/<%= pkg.name %>-<%= pkg.version%>.min.css',
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version%>.zip'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-zip');

  // Default task(s).
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('build', ['clean', 'browserify', 'uglify']);
  grunt.registerTask('package', ['build', 'zip']);
  grunt.registerTask('default', ['clean', 'build']);

};
