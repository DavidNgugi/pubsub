const axios = require('axios');
const request = require('supertest');
const pub_routes = require('../routes')(client);
const create_app = require('../../shared/app');
const { jsonify } = require('../../shared/utils');

describe('Publisher routes tests', () => {
    const pubMockListen = jest.fn((port = 8001, hostname = '0.0.0.0'));

    let pub_server = create_app(pub_routes);

    pub_server.listen = pubMockListen;

    pub_server.close = jest.fn();

    beforeEach(() => {
        // jest.useFakeTimers()
        jest.clearAllMocks();
        pubMockListen.mockReset();
    });

    afterEach(() => {
        pub_server.close()
        jest.resetAllMocks();
    })

    it('should subscribe to a topic', async () => {
        const expected_response = {
            topic: 'test',
            url: 'http://0.0.0.0:9001/'
        };

        jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: expected_response });

        const res = await request(pub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                topic: 'test',
                url: 'http://0.0.0.0:9001/',
            });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(expected_response);
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('should not subscribe to a topic if topic is missing', async () => {
        const expected_response = jsonify("No topic provided")

        const res = await request(pub_server).post('/subscribe/')
            .set('Accept', 'application/json')
            .send({
                url: 'http://0.0.0.0:9001/'
            });

        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual(expected_response);
        expect(axios.post).toHaveBeenCalledTimes(0);
    });

    it('should not subscribe to a topic if subscriber down', async () => {
        const expected_response = jsonify("Internal Server Error. Couldn't subscribe to topic test.")

        jest.spyOn(axios, 'post').mockRejectedValue(new Error("Internal Server Error. Couldn't subscribe to topic test."));

        const res = await request(pub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                url: 'http://0.0.0.0:9001/'
            });

        expect(res.status).toBe(500);
        expect(res.body).toStrictEqual(expected_response);
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('should not subscribe to a topic if url missing', async () => {
        const expected_response = jsonify('No url provided');
        const res = await request(pub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                link: 'http://0.0.0.0:9001/',
            });

        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual(expected_response);
        expect(axios.post).toHaveBeenCalledTimes(0);
    });

    it('should not subscribe to a topic if url is invalid', async () => {
        const expected_response = jsonify('Bad Request. Valid url required')
        const res = await request(pub_server).post('/subscribe/test')
            .set('Accept', 'application/json')
            .send({
                url: 'fake_url'
            });

        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual(expected_response);
        expect(axios.post).toHaveBeenCalledTimes(0);
    });

    it('should publish a message to a topic', async () => {
        const expected_message = JSON.stringify({
            message: 'test message'
        })
        const topic = 'test';
        const res = await request(pub_server).post(`/publish/${topic}`)
            .set('Accept', 'application/json')
            .send({
                message: 'test message'
            });
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(jsonify(`Published message ${expected_message} to topic ${topic}`))
        expect(client.publish).toHaveBeenCalledWith(topic, expected_message);
    });

    it('should not publish a message to a topic if redis is down', async () => {
        client.publish = jest.fn((channel, message, handleReply) => {
            throw new Error('Redis Publish Error');
        })
        const topic = 'test';
        const res = await request(pub_server).post(`/publish/${topic}`)
            .set('Accept', 'application/json')
            .send({
                message: 'test message'
            });

        expect(res.status).toBe(500);
        expect(res.body).toStrictEqual(jsonify(`Error publishing to topic ${topic}`))
        expect(client.publish).toHaveBeenCalledWith(topic, JSON.stringify({
            message: 'test message'
        }));
    });

});