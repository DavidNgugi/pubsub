const redis = require('redis');

const client = (config) => {
    redis.debug_mode = config.env == 'development';
    return redis.createClient({
        port: config.redis_port,
        host: config.redis_host
    }).on("message", (channel, message) => {
        console.log(`Subscriber Received data : ${message} on channel ${channel}`);
    }).on('error', (err) => {
        throw Error(`Redis client Error: ${err.message}`);
    })
}

module.exports = client;
