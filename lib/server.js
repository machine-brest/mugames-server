'use strict';

/**
 * Module dependencies
 * @private
 */

var conf    = require('./conf')
  , log     = require('./log')(module)
  , channel = require('./channel')
  , http    = require('http');

var server = exports = module.exports = {};

/**
 * @public
 */
server.createServer = function()
{
    this.app = require('express')();
    this.app.get('/engine.io', function(req, res, next) {
        next()
    });

    this.app.get('/', function (req, res, next) {
        res.json({status: 'ok', name: 'mugames server [http, ws:channel]'});
    });
};

/**
 * @public
 */
server.start = function()
{
    var httpIP   = process.env.IP   || conf.get('http:ip');
    var httpPort = process.env.PORT || conf.get('http:port');

    this.httpServer = http.createServer(this.app);
    this.channel = channel.createChannel({
        server: server.httpServer
    });

    this.httpServer.listen(httpPort, httpIP, function() {
        log.debug('Server listening at %s:%d (env: %s)',
            httpIP, httpPort, conf.get('env'));
    });
};
