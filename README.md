OptBot UI
=========
Description
--
Web-based UI for the optbot service.

Usage
--

###Install

	$ npm install

###Run

	$ npm start

###Configuration

To configure settings, this package uses the `npm config` options detailed [here](https://docs.npmjs.com/files/package.json#config).

###Examples

To change the listening port

	$ npm config set @optbot/ui:port 18081 --global

To change the bound host

	$ npm config set @optbot/ui:host 127.0.0.1 --global

Testing
--

If the service is running on port `8080` on a host with IP address `91.198.174.192`, navigate to `http://91.198.174.192:8080/` in a web browser.

### Code conformity
    $ jshint lib test
    $ jscs .

Connects To
--
[optbot/restapi](https://github.com/optbot/restapi)