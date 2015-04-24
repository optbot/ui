(function() {
  'use strict';

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  var fs = require('fs');
  var path = require('path');
  var config = require('./config/config.js');
  var express = require('express');
  var exphbs = require('express-handlebars');
  var app = express();

  var VIEW_EXT = '.hbs';
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

  /* The 'public' folder contains all static content served from the /static path prefix. */
  app.use('/static', express.static(__dirname + '/public'));
  app.engine(VIEW_EXT, exphbs({defaultLayout: 'main', extname: VIEW_EXT}));
  app.set('view engine', VIEW_EXT);

  // Not found (404) http://expressjs.com/starter/faq.html
  app.use(function(req, res, next) {
    res.status(404).render('errors/404');
  });

  // Unhandled errors (500) http://expressjs.com/starter/faq.html
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('errors/500', {error: err});
  });

  var host = process.env.npm_package_config_host;
  var port = process.env.npm_package_config_port;

  var server = app.listen(port, host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Express server started at http://%s:%s', host, port);
  });
})();
