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

OR you can start the Node server with options (notice the first `--` for optional args):

    $ npm start [-- [--port=your_port] [--host=your_host]]


###Default values

- Host: Any
- Port: 8080

###Examples

**Start production** (binds to any address, port 8080)

	$ npm start

**Start local** (binds only to local address, port 8080)

	$ npm start -- --host=127.0.0.1

**Start production on a different port** (binds to any address)

	$ npm start -- --port=12345

**Start production on a different host and port**

	$ npm start -- --host=127.0.0.1 --port=12345

Testing
--

If the service is running on port `8080` on a host with IP address `91.198.174.192`, navigate to `http://91.198.174.192:8080/` in a web browser.


Connects To
--
[optbot/restapi](https://github.com/optbot/restapi)