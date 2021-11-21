const redis = require('redis');

const client = (config) => {
    redis.debug_mode = config.env == 'development';
    return redis.createClient({
        port: config.redis_port,
        host: config.redis_host
    })
}

module.exports = client;
