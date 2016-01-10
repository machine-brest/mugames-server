var conf = require('./lib/conf')
  , log  = require('./lib/log')(module)
  , util = require('util')
  , eio  = require('engine.io-client');

var httpIp   = 'localhost';
var httpPort = conf.get('http:port');
var wsUri    = util.format('ws://%s:%d', httpIp, httpPort);

log.debug(wsUri);

var socket = new eio.Socket(wsUri, {transports: ['websocket']});

socket.onopen = function() {
	log.debug('connected to channel %s', wsUri);
};

socket.onclose = function() {
	log.debug('connection lost');
};
