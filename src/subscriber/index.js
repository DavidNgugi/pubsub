const app = require('../shared/app');
const config = require('../shared/config');
const error_handler = require('../shared/middleware/error_handler');

const client = require('../shared/client')(config);

const routes = require('./routes')(client);

app.use('/', routes);

app.use(error_handler);

const listener = app.listen(config.sub_port, function () {
    console.log('Your subscriber for topic 1 is listening on port ' + listener.address().port);
});


