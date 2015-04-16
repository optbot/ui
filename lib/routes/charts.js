var config = require('../config/config.js'),
    express = require('express'),
    router = express.Router()

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    res.locals.layout = 'charts'
    next()
})

router.get('/', function (req, res) {
    var model = {
        restUrl: config.get('web:resturl')
    }

    res.render('charts/index', model)
})

module.exports = router