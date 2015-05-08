(function() {
  'use strict';

  var VIEW_EXT = '.hbs';

  var hbsopts = {
    defaultLayout: 'main',
    extname: VIEW_EXT,
    helpers: {
      select: function(idName, value, options) {
        if (idName && !value) {
          value = idName;
        }

        var el = '<select';
        if (idName) {
          el += ' id=\'' + idName + '\' name=\'' + idName + '\'';
        }
        el += '>';

        el += options.fn(this)
          .split('\n')
          .map(function(v) {
                var t = 'value="' + value + '"';
                return !(new RegExp(t).test(v)) ?
                  v :
                  v.replace(t, t + ' selected="selected"');
              })
          .join('\n');

        el += '</select>';

        return el;
      }
    }
  };

  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  var log = require('./logger');
  var renderPartial = require('./renderPartial.js');
  var express = require('express');
  var exphbs = require('express-handlebars');
  var hbs = exphbs.create(hbsopts);
  var app = express();

  /* The 'public' folder contains all static content served from the /static path prefix. */
  app.use('/static', express.static(__dirname + '/public'));
  app.engine(VIEW_EXT, hbs.engine);
  app.set('view engine', VIEW_EXT);

  /**
   * This method installs middleware to override the default render function
   * and provide custom values during template rendering.
   */
  app.use(function(req, res, next) {
    var _render = res.render;
    res.render = function(view, options, fn) {
      options = options || {};
      util._extend(options, {req: req, res: res});
      _render.call(this, view, options, fn);
    };
    next();
  });

  var ROUTES_DIR = path.resolve(__dirname, 'routes');

  /* Load routing modules (like controllers), by name. */
  var routers = fs.readdirSync(ROUTES_DIR);
  for (var i = 0; i < routers.length; i++) {
    var router = routers[i];
    var ext = path.extname(router);

    // Rebuild the path to the router file.
    var routerPath = path.resolve(ROUTES_DIR, router);

    var routerModule;
    if (router === 'home.js') {
      routerModule = require(routerPath);

      // The home controller is an exception; mount this at root.
      app.use('/', routerModule);
    } else if (ext === '.js') {
      // Get just the name of the file without the ext.
      var base = path.basename(router, '.js');

      // Load the module as a router module into Express,
      // and use the name as the URL prefix to set the proper mounting point.
      routerModule = require(routerPath);
      app.use('/' + base, routerModule);
    }
  }

  // Not found (404) http://expressjs.com/starter/faq.html
  app.use(function(req, res, next) {
    res.status(404).render('errors/404');
  });

  // Unhandled errors (500) http://expressjs.com/starter/faq.html
  app.use(function(err, req, res, next) {
    console.error(err.message);
    res.status(500).render('errors/500', {error: err});
  });

  var host = process.env.npm_package_config_host;
  var port = process.env.npm_package_config_port;

  var server = app.listen(port, host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Express server started at http://%s:%s', host, port);
    log.info('Express server started at http://%s:%s', host, port);
  });

  // This function is called when you want the server to die gracefully.
  // i.e. wait for existing connections
  var gracefulShutdown = function() {
    log.info('Received kill signal, shutting down gracefully.');
    server.close(function() {
      var msg = 'Server shutting down...';
      log.info(msg);
      process.exit();
    });

    // Just to be safe, we also impose a ten second maximum shutdown time
    // because some browsers keep the sockets open for a prolonged period.
    setTimeout(function() {
      var errMsg =
        'Could not close connections in time, forcefully shutting down!';

      log.error(errMsg);
      process.exit();
    }, 10 * 1000);
  };

  // Listen for TERM signal .e.g. kill. (forever uses this approach)
  process.on('SIGTERM', gracefulShutdown);

  // Listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', gracefulShutdown);
})();
