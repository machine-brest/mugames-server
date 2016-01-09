'use strict';

/**
 * Module dependencies
 * @private
 */

var nconf = require('nconf')
  , path  = require('path')
  , fs    = require('fs');

var env = process.env.NODE_ENV || 'development';

nconf.env();
nconf.argv({
    "i": {
        alias: 'infr',
        describe: 'Server infrastucture',
        type: 'string',
        default: 'local'
    }
});

console.log('Configuring server infrastucture: %s', nconf.get('infr'));

var appPath = path.dirname(process.argv[1]);
var confPath = path.join(appPath, path.sep + 'conf');
var infr = nconf.get('infr');

if (infr != 'local')
    confPath = path.join(confPath, path.sep + infr);

var confFile = path.join(confPath, path.sep + 'conf.' + env + '.json');

if (fs.existsSync(confFile)) {
    console.log('Using configuration: %s', path.relative(appPath, confFile));
    nconf.file(confFile);
}

// Default values

nconf.defaults({
    'env': env,
    'log': {
        'colorize': true,
        'level': 'debug'
    }
});

module.exports = nconf;
