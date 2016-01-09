'use strict';

/**
 * Module dependencies
 * @private
 */

var conf    = require('./conf')
  , log     = require('./log')(module)
  , http    = require('http');

var server = exports = module.exports = {};

/**
 * @public
 */
server.createServer = function()
{
    this.app = require('express');
};

/**
 * @private
 */
function createClientChannel()
{
    var self = server;
    self.eioServer = require('engine.io')
        .attach(self.httpServer);
}

/**
 * @public
 */
server.start = function()
{
    var httpIP   = process.env.IP   || conf.get('http:ip');
    var httpPort = process.env.PORT || conf.get('http:port');

    this.httpServer = http.createServer(this.app);
    this.httpServer.listen(httpPort, httpIP, function() {

        log.debug('Server listening at %s:%d (env: %s)',
            httpIP, httpPort, conf.get('env'));

        createClientChannel();
    });
};
