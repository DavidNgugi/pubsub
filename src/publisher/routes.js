const { checkRedis, jsonify } = require('../shared/utils');
const axios = require('axios');
const validUrl = require('valid-url');
const router = require('express').Router();

class PublisherError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

const routes = (client) => {

    router.post('/subscribe/:topic?', async (req, res, next) => {
        try {
            if (!req.params.topic) {
                throw new PublisherError('No topic provided', 400);
            }

            const topic = req.params.topic;

            if (typeof req.body.url === 'undefined') {
                throw new PublisherError('No url provided', 400);
            }

            if (validUrl.isUri(req.body.url) === undefined) {
                throw new PublisherError('Bad Request. Valid url required', 400);
            }

            const url = req.body.url;

            const response = await axios.post(`${url}`, {
                topic: topic,
                url: url
            }).catch(err => {
                throw new PublisherError(`Internal Server Error. Couldn't subscribe to topic ${topic}.`);
            });

            const handleReply = (err, reply) => {
                if (err) throw new PublisherError(`Couldn't register subscriber. url: ${url}, topic: ${topic}.`);
            }
            // register topic subscribers on redis
            client.hset(`subscribers:${topic}`, topic, url, handleReply);

            res.json(response.data).status(200);
        } catch (err) {
            next(err)
        }
    });

    router.post('/publish/:topic', async (req, res, next) => {
        const topic = req.params.topic;
        try {
            const message = JSON.stringify(req.body)
            client.publish(topic, message)
            res.send(jsonify(`Published message ${message} to topic ${topic}`)).status(200);
        } catch (e) {
            const err = new PublisherError(`Error publishing to topic ${topic}`);
            next(err)
        }
    });

    return router;
};

module.exports = routes;