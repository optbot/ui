var async = require('async');
var rest = require('rest');
var moment = require('moment');
var express = require('express');
var router = express.Router();

var restBase = process.env.npm_package_config_resturl;

router.use(function setChartsLayout(req, res, next) {
  res.locals.layout = 'charts';
  next();
});

var restStrikes = function(query, cb) {
  var url = restBase + '/strikes/' + query;

  rest(url).then(function(response) {
    var strikes = [];

    if (response.entity) {
      var entity = JSON.parse(response.entity);

      if (entity.strikes && entity.strikes.length > 0) {
        strikes = entity.strikes;

        strikes = strikes
          .map(function(s) { return parseFloat(s); })
          .sort(function(a, b) { return a - b; });
      }
    }

    cb(null, strikes);
  });
};

var restExpiries = function(query, cb) {
  var url = restBase + '/expiries/' + query;

  rest(url).then(function(response) {
    var expiries = [];

    if (response.entity) {
      var entity = JSON.parse(response.entity);

      if (entity.expiries && entity.expiries.length > 0) {
        expiries = entity.expiries;

        expiries = expiries
          .map(function(e) { return Date.parse(e); })
          .sort()
          .map(function(e) {
            var d = moment.utc(e);
            return d.format('MM/DD/YYYY hh:mm');
          });
      }
    }

    cb(null, expiries);
  });
};

var restOptions = function(query, cb) {
  var url = restBase + '/options/' + query;

  rest(url).then(function(response) {
    if (response.entity) {
      cb(null, response.entity);
      return;
    }

    cb(err, []);
  });
};

router.get('/', function(req, res, next) {
  var model = {filter: {}};

  if (req.xhr) {
    var qsIdx = req.url.indexOf('?');
    if (qsIdx < 0) {
      res.status(403).send('Missing query');
      return;
    }
    var query = req.url.substr(qsIdx);

    model.filter.equity = req.query.equity;
    model.filter.option = req.query.option;
    model.filter.strike = req.query.strike;
    model.filter.expiry = req.query.expiry;

    var getStrikes = (model.filter.equity || false) &&
                     (model.filter.option || false) &&
                     !(model.filter.strike || false) &&
                     !(model.filter.expiry || false);

    var getExpiries = (model.filter.equity || false) &&
                      (model.filter.option || false) &&
                      (model.filter.strike || false) &&
                      !(model.filter.expiry || false);

    var getOptions = (model.filter.equity || false) &&
                     (model.filter.option || false) &&
                     (model.filter.strike || false) &&
                     (model.filter.expiry || false);

    if (getStrikes) {
      restStrikes(query, function(err, strikes) {
        model.strikes = strikes;
        res.renderPartial('charts/_filters', model);
      });
    } else if (getExpiries) {
      async.parallel(
        [
          restStrikes.bind(null, query),
          restExpiries.bind(null, query)
        ],
        function(err, results) {
          model.strikes = results[0];
          model.expiries = results[1];
          res.renderPartial('charts/_filters', model);
        });
    } else if (getOptions) {
      restOptions(query, function(err, options) {
        res.json(options);
      });
    } else {
      res.renderPartial('charts/_filters', model);
    }
  } else {
    res.render('charts/index', model);
  }
});

module.exports = router;
