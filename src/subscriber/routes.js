const router = require('express').Router();
const { checkRedis } = require('../shared/utils');

const routes = (client) => {

    router.post('/:params?', async (req, res) => {
        const topic = req.body.topic;
        const data = {
            topic: topic,
            url: req.body.url
        };
        client.subscribe(topic, (err, count) => {
            if (err) throw new Error(err.message);
            console.log(`Subscribed to ${count} channels.`);
            res.send(JSON.stringify(data));
        });
    });

    // added route for healchecks if the app is up and running well
    router.get('/healthcheck', async (req, res) => {
        return res.send('Subscriber up').status(200) ? checkRedis(client) : res.send('Subscriber down').status(500);
    });

    return router;
};

module.exports = routes;