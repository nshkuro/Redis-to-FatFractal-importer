var redis   = require("redis"),
    winston = require('winston'),
    config = require("./config/config.json"),
    logger = new (winston.Logger)({    
    transports: [      
        new (winston.transports.Console)({colorize: true}),
        new (winston.transports.File)({ filename: 'app.log' })
      ]
    }),
    FF = require("./lib/FF"),
    FatFractal = new FF(config.FatFractal.username, config.FatFractal.password, config.FatFractal.url);

logger.info('Application is run');

var options = {};
config.redis.password ? options.auth_pass = config.redis.password : options.auth_pass = null;
var clientSubscribe = redis.createClient(config.redis.port, config.redis.host, options);
var client = redis.createClient(config.redis.port, config.redis.host, options);

clientSubscribe.on("error", function (err) {
  logger.error(err);
});

client.on("error", function (err) {
  logger.error(err);
});

if (clientSubscribe && client) {
  logger.info("Redis: connected to host: %s, port: %s", clientSubscribe.host, clientSubscribe.port);
}

clientSubscribe.subscribe(config.redis.channel);

logger.info("Redis: subscribe on channel: %s", config.redis.channel);

clientSubscribe.on("message", function(channel, key){
    logger.info("channel : %s, the message : %s", channel, key);
    
    client.hgetall(key, function(err, object) {
      if (err) {
        logger.error(err);  
      }
      
      var key_arr = key.split(':');
      var collection = key_arr[0];

      FatFractal.saveObject(collection, object, function(obj, msg) {        
        if (typeof obj != 'object') {
          logger.error(obj);
          logger.error(msg);
        } else {
          logger.info(msg);  
        }        
      });
    });

});