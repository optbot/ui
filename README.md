OptBot UI
=========
Description
--
Web-based UI for the optbot service.

Build
--
1.  Install [Node and npm](https://nodejs.org/download/). In Linux, `npm` may require a separate install, 
    as described [here](https://docs.npmjs.com/getting-started/installing-node).

2.  Build the app:

        $ cd <project root>
        $ npm install

3.  Verify that dependencies have been built to `<project root>/node_modules/`

Run
--
1.  Start the Node server (notice the first `--` for optional args):

        $ npm start [-- [--port=your_port] [--host=your_host]]

2.  The site can be navigated to by the IP and port that was bound. **If not changed**, the defaults are **any IP** address and **port 8080**.

Examples
--

**Start local** (binds only to local address)

	$ npm start -- --host=127.0.0.1

**Start production** (binds to any address)

	$ npm start

**Start on a different port**

	$ npm start -- --port=12345