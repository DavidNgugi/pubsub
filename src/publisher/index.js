const config = require('../shared/config');
const client = require('../shared/client')(config);

const routes = require('./routes')(client);
const create_app = require('../shared/app');

const app = create_app(routes);

if (config.env !== 'test') {
    const listener = app.listen(config.pub_port, function () {
        console.log('Your app is listening on port ' + listener.address().port);
    });
}

