var config = require('../config/config.js')
var express = require('express')
var router = express.Router()

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    res.locals.layout = 'charts'
    next()
})

router.get('/', function (req, res) {
    var model = {
        restUrl: config.web.rest_url
    }

    res.render('charts/index', model)
})

module.exports = router