const router = require('express').Router();
const { checkRedis } = require('../shared/utils');

class SubscriberError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

const routes = (client) => {

    router.post('/*', async (req, res, next) => {
        try {

            if (!checkRedis(client)) {
                throw new SubscriberError(`Subscriber down`, 500)
            }

            if (!req.body.topic) {
                throw new SubscriberError('No topic provided', 400);
            }

            const topic = req.body.topic;

            if (typeof req.body.url === 'undefined') {
                throw new SubscriberError('No url provided', 400);
            }

            const data = {
                topic: topic,
                url: req.body.url
            };

            try {
                client.subscribe(topic);
            } catch (err) {
                throw new SubscriberError(`Couldn't subscribe to topic ${topic}.`, 500);
            }

            res.json(data).status(200);

        } catch (err) {
            next(err);
        }
    });

    return router;
};

module.exports = routes;