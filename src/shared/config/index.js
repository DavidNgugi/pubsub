require('dotenv').config()

const config = {
    env: process.env.NODE_ENV || 'development',
    sub_port: process.env.SUB_PORT || 9000,
    pub_port: process.env.PUB_PORT || 8000,
    redis_port: process.env.REDIS_PORT || 6379,
    redis_host: process.env.REDIS_HOST || '127.0.0.1',
    redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
    redis_expiration: process.env.REDIS_EXPIRATION || 60,
}

module.exports = config;
