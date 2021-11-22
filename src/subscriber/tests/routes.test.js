const request = require('supertest');
const sub_routes = require('../routes')(client);
const create_app = require('../../shared/app');
const { jsonify } = require('../../shared/utils');

describe.only('Subscriber routes tests', () => {
    const subMockListen = jest.fn((port = 9001, hostname = '0.0.0.0'));

    let sub_server = create_app(sub_routes);

    sub_server.listen = subMockListen;

    sub_server.close = jest.fn();

    beforeEach(() => {
        // jest.useFakeTimers()
        jest.clearAllMocks();
        subMockListen.mockReset();
        client.ping = jest.fn(() => true);
    });

    afterEach(() => {
        sub_server.close()
        jest.resetAllMocks();
    })

    it('has not subscribe if redis is unhealthy or down', async () => {
        client.ping = jest.fn(() => false);

        const expected_response = jsonify('Subscriber down');

        const res = await request(sub_server).post('/').send({
            topic: 'test',
            url: 'http://0.0.0.0:9001/',
        });

        expect(res.status).toBe(500);
        expect(res.body).toStrictEqual(expected_response);
    });

    it('should subscribe to a topic', async () => {
        const topic = 'test';

        const expected_response = {
            topic: topic,
            url: 'http://0.0.0.0:9001/'
        };
        const res = await request(sub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                topic: topic,
                url: 'http://0.0.0.0:9001/',
            });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(expected_response);
        expect(client.subscribe).toHaveBeenCalledWith(topic);
    });

    it('should not subscribe to a topic if topic is missing', async () => {
        const expected_response = jsonify("No topic provided")

        const res = await request(sub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                url: 'http://0.0.0.0:9001/'
            });

        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual(expected_response);
    });

    it('should not subscribe to a topic if url missing in data', async () => {
        const expected_response = jsonify('No url provided');
        const res = await request(sub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                topic: 'test',
                link: 'http://0.0.0.0:9001/',
            });

        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual(expected_response);
    });

    it('should not subscribe to a topic if redis subscribe fails', async () => {
        client.subscribe = jest.fn((channel, handleReply) => {
            throw new Error('Redis subscribe Error', 500);
        })
        const topic = 'test';
        const res = await request(sub_server).post(`/subscribe/${topic}`)
            .set('Accept', 'application/json')
            .send({
                topic: topic,
                url: 'http://0.0.0.0:9001/'
            });
        expect(res.status).toBe(500);

        expect(res.body).toStrictEqual(jsonify(`Couldn't subscribe to topic ${topic}.`))
        expect(client.subscribe).toHaveBeenCalledWith(topic);
    });

});