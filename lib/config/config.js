var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf')

// Load the default config values.
var defaultConfig = path.join(__dirname, 'config.json')
nconf.file(defaultConfig)

// Check for an environment-specific config and override values.
if (process.env.NODE_ENV) {
    var envConfig = path.join(__dirname, 'config.' + process.env.NODE_ENV + '.json')
    if (fs.existsSync(envConfig)) {
        nconf.file(envConfig)
    }
}

// Override all other settings first from env then args.
nconf.env()
     .argv()

//var env = process.env.NODE_ENV || 'development'
//module.exports = require('./config.' + env + '.js')
module.exports = nconf