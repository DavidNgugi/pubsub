const { checkRedis } = require('../shared/utils');
const axios = require('axios');
const validUrl = require('valid-url');
const router = require('express').Router();

const routes = (client) => {

    router.post('/subscribe/:topic', async (req, res) => {
        const topic = req.params.topic;

        if (typeof req.body.url === 'undefined') {
            throw new Error('No url provided');
        }

        if (validUrl.isUri(req.body.url) === undefined) {
            throw new Error('Bad Request. Valid url required');
        }

        const url = req.body.url;

        const response = await axios.post(`${url}`, {
            topic: topic,
            url: url
        }).catch(err => {
            throw new Error(`Internal Server Error. Couldn't subscribe to topic ${topic}. Error ${err}`);
        });

        console.log("subscribe to a topic", response.data);
        if (!res.status === 200) {
            throw new Error('invalid topic');
        }

        const handleReply = (err, reply) => {
            if (err) throw new Error(err.message);
            console.log(`Subscribed to ${reply} channel.`);
        }
        // register topic subscribers on redis
        await client.hset(`subscribers:${topic}`, topic, url, handleReply);

        res.send(JSON.stringify(response.data));
    });

    router.post('/publish/:topic', async (req, res) => {
        const topic = req.params.topic;
        try {
            const message = JSON.stringify(req.body)
            client.publish(topic, message)
            res.send(`Publishing message ${message} to topic ${topic}`).status(200);
        } catch (err) {
            throw new Error(`Error publishing to topic ${topic} , ${err}`);
        }
    });

    // added route for healchecks if the app is up and running well
    router.get('/healthcheck', async (req, res) => {
        return res.send('Publisher up').status(200) ? checkRedis(client) : res.send('Publisher down').status(500);
    });

    return router;
};

module.exports = routes;