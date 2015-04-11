module.exports = function(grunt) {
    /**
     * shelljs : http://documentup.com/arturadib/shelljs
     */
    var shell = require('shelljs'),
        execCmd = function(cmd, i, arr) {
            shell.exec(cmd)
        };
    
    grunt.registerTask('default', function() {
        execCmd('node app.js');
    });
};