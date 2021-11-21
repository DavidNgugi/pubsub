const config = require('../shared/config');
const client = require('../shared/client')(config);

const routes = require('./routes')(client);
const create_app = require('../shared/app');

const app = create_app(routes);

// client.on("message", (channel, message) => {
//     console.log(`Subscriber Received data : ${message} on channel ${channel}`);
// }).on('error', (err) => {
//     throw Error(`Redis client Error: ${err.message}`);
// })


if (config.env !== 'test') {
    const listener = app.listen(config.sub_port, function () {
        console.log('Your subscriber for topic 1 is listening on port ' + listener.address().port);
    });
}


