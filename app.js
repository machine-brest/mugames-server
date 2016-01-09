'use strict';

var server = require('./lib/server')
  , conf   = require('./lib/conf');

server.createServer();
server.start();
