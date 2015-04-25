var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  res.locals.layout = 'charts';
  next();
});

router.get('/', function(req, res) {
  var model = {restUrl: process.env.npm_package_config_resturl};

  if (req.xhr) {
    model.equity = req.query.equity;
    if (!model.equity) {
      res.status('403').json({error: 'Missing required query parameters'});
      return;
    }

    res.renderPartial('charts/_filters', model);
  } else {
    res.render('charts/index', model);
  }
});

module.exports = router;
