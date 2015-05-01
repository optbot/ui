module.exports = (function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var bunyan = require('bunyan');

  var logfile = process.env.npm_package_config_logfile;
  var streams = [];

  if (!logfile) {
    console.warn('%s not defined! File logging disabled.',
        'npm_package_config_logfile');
  } else {
    var dir = path.dirname(logfile);
    var stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      console.warn('%s does not exist! File logging disabled.', dir);
    } else {
      streams.push({
        level: 'trace',
        type: 'rotating-file',
        path: logfile
      });
    }
  }

  // No file configured? Log to console.
  if (streams.length === 0) {
    streams.push({level: 'error', stream: process.stderr});
    streams.push({level: 'info', stream: process.stdout});
  }

  return bunyan.createLogger({name: 'ui', streams: streams});
})();
