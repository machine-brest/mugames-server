var winston = require('winston')
  , path    = require('path')
  , conf    = require('./conf');

module.exports = function(module)
{
    var appPath    = path.dirname(process.argv[1]);
    var modulePath = path.relative(appPath, module.filename);

    var label = modulePath.split(path.sep).join('/');
    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize: conf.get('log:colorize'),
                level:    conf.get('log:level'),
                label:    label
            })
        ]
    });
};
