jest.mock('axios');

// mock redis createClient method
global.redis = {
    createClient: jest.fn(() => {
        return {
            on: jest.fn(),
            subscribe: jest.fn((channel, handleReply) => {
                handleReply(null, 'OK');
            }),
            publish: jest.fn((channel, message, handleReply) => {
                handleReply(null, 'OK');
            }),
            hset: jest.fn((key, field, value, handleReply) => {
                handleReply(null, 'OK');
            }),
            end: jest.fn()
        }
    })
};

global.client = redis.createClient();

// mock the shared config 
global.config_mock = {
    env: 'test',
    sub_port: 9000,
    pub_port: 8000,
    redis_port: 6379,
    redis_host: '127.0.0.1',
    redis_url: 'redis://localhost:6379',
    redis_expiration: 60
}

process.env = {
    NODE_ENV: 'test',
    REDIS_PORT: 6379,
    REDIS_HOST: '127.0.0.1',
    REDIS_URL: 'redis://:127.0.0.1:6379',
    SUB_PORT: 9000,
    PUB_PORT: 8000
}