'use strict';

/**
 * Module dependencies
 * @private
 */

var conf    = require('./conf')
  , log     = require('./log')(module)
  , http    = require('http');

var server = exports = module.exports = {};

server.createServer = function()
{
    this.app = require('express');
    this.httpServer = http.createServer(this.app);
};

server.start = function()
{
    var httpIP   = process.env.IP   || conf.get('http:ip');
    var httpPort = process.env.PORT || conf.get('http:port');

    this.httpServer.listen(httpPort, httpIP, function() {
        log.debug('event server listening at %s:%d (env: %s)',
            httpIP, httpPort, conf.get('env'));
    });
};
