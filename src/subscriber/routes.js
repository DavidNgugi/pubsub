const router = require('express').Router();
const { checkRedis } = require('../shared/utils');

const routes = (client) => {

    router.post('/:params?', async (req, res, next) => {
        const topic = req.body.topic;
        try {

            if (typeof req.body.url === 'undefined') {
                throw new Error('No url provided');
            }

            const data = {
                topic: topic,
                url: req.body.url
            };
            client.subscribe(topic, (err, count) => {
                if (err) throw new Error(`Couldn't subscribe to topic ${topic}. ${err.message}`);
                res.send(JSON.stringify(data));
            });
        } catch (err) {
            next(err);
        }
    });

    // added route for healchecks if the app is up and running well
    router.get('/healthcheck', async (req, res) => {
        return res.send('Subscriber up').status(200) ? checkRedis(client) : res.send('Subscriber down').status(500);
    });

    return router;
};

module.exports = routes;