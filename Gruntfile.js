'use strict';

var request = require('request');

module.exports = function (grunt) {
  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      jade: {
        files: ['app/views/**/*.jade'],
        options: { livereload: reloadPort },
      },
      styl: {
        files: ['app/views/style/*.styl'],
        task: ['develop', 'delayed-livereload']
      },
      css: {
        files: ['public/css/*.css'],
        options: { livereload: reloadPort }
      },
      coffee: {
        files: [
          'app/controllers/*.coffee',
          'app/models/*.coffee'
          ],
        options: { livereload: reloadPort },
      },
    },
    stylus: {
      compile: {
        options: {
          paths: ['app/views/style'],
          compress: true,
        },
        files: {
          'public/css/style.css': 'app/views/style/style.styl'
        }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', [
    // 'coffee',
    'stylus',
    'develop',
    'watch'
  ]);

  grunt.registerTask('reload', [
    'stylus',
    'watch'
  ])
};
