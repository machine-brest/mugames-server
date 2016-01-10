'use strict';

/**
 * Module dependencies
 * @private
 */

var redis    = require('redis')
  , conf     = require('./conf')
  , log      = require('./log')(module)
  , engineio = require('engine.io');

var channel = exports = module.exports = {};

channel.createChannel = function(opts)
{
    opts = opts || {};

    var self = this;
    var options = {
        server: opts.server,
        rpcChannel: 'rpc:channel',
        eventChannel: 'event:channel',
        redis: opts.redis || {
            'hostname': 'localhost',
            'port': 6379
        }
    };

    // Create two connection to redis (subscribe and publish)

    var redisSubClient = redis.createClient();
    var redisPubClient = redis.createClient();
    var redisMonitor   = redis.createClient();

    if (options.redis.password != undefined) {
        redisSubClient.auth(options.redis.password);
        redisPubClient.auth(options.redis.password);
        redisMonitor.auth(options.redis.password);
    }

    redisMonitor.monitor(function(err, res) {
        log.debug("Entering monitoring mode");
    });

    redisMonitor.on("monitor", function(time, args) {
        console.log(time + ": " + JSON.stringify(args));
    });

    redisSubClient.on('subscribe', function(channel, count) {
        log.debug('subscribed to %s. total subs: %d', channel, count);
    });

    redisSubClient.once('ready', function()
    {
        log.debug('connected to redis database');

        redisSubClient.subscribe(options.rpcChannel);
        redisSubClient.subscribe(options.eventChannel);

        log.debug('Attaching websocket server to listening port');

        self.eioServer = engineio();
        self.eioServer.attach(options.server, {transports: ['websocket']});
        options.server.on('upgrade', function(req, socket, head) {
            self.eioServer.handleUpgrade(req, socket, head);
        });

        self.eioServer.on('connection', function(socket)
        {
            log.debug('new subscriber connected');

            socket.publishListener = function(channel, message) {
                socket.send(message);
            };

            socket.on('message', function(msg)
            {
                var event = JSON.parse(msg);
                if (event.type == 'chat')
                    redisPubClient.publish(options.chatChannel, msg);
            });

            redisSubClient.on('message', socket.publishListener);

            socket.on('close', function() {
                log.debug('subscriber lost');
                redisSubClient.removeListener('message', socket.publishListener);
                socket.publishListener = null;
            });
        });
    });
};
