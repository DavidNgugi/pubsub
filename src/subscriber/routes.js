const router = require('express').Router();
const { checkRedis, jsonify } = require('../shared/utils');

class SubscriberError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

const routes = (client) => {

    router.post('/:params?', async (req, res, next) => {
        const topic = req.body.topic;
        try {

            if (typeof req.body.url === 'undefined') {
                throw new SubscriberError('No url provided', 400);
            }

            const data = {
                topic: topic,
                url: req.body.url
            };
            client.subscribe(topic, (err, count) => {
                if (err) throw new SubscriberError(`Couldn't subscribe to topic ${topic}.`, 500);
                res.send(JSON.stringify(data)).status(200);
            });
        } catch (err) {
            next(err);
        }
    });

    // added route for healchecks if the app is up and running well
    router.get('/healthcheck', async (req, res) => {
        try {
            if (!checkRedis(client)) {
                throw new SubscriberError('Subscriber down', 500)
            }
            return res.send(jsonify('Subscriber up')).status(200);
        } catch (err) {
            next(err);
        }
    });

    return router;
};

module.exports = routes;