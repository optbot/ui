var config = {};
config.web = {};

config.web.host = process.env.HOST || '127.0.0.1';
config.web.port = process.env.PORT || 8080;

config.web.rest_url = process.env.OPTBOT_REST_URL || 'http://127.0.0.1:8081/api/';

module.exports = config;