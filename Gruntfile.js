module.exports = function(grunt) {

// Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-angular-translate');
  
  // Project configuration.
  grunt.initConfig({
    i18nextract: {
      default_options: {
        customRegex: [
            'trans\\s*\\(\\s*\'((?:\\\\.|[^\'\\\\])*)\'[^\\)]*\\)',
            'trans\\s*\\(\\s*"((?:\\\\.|[^\'\\\\])*)"[^\\)]*\\)'
        ],
        namespace: true,
        defaultLang:'pt_BR',
        prefix: 'locale-',
        src: [ 'www/js/**/*.js', 'www/templates/**/*.html' ],
        lang:     ['pt_BR'],
        dest:     'www/lang'
      }
    },
  });

  

  // Default task(s).
  grunt.registerTask('default', ['i18nextract']);

};