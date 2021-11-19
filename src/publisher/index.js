const app = require('../shared/app');
const config = require('../shared/config');
const error_handler = require('../shared/middleware/error_handler');
const client = require('../shared/client')(config);

const routes = require('./routes')(client);

app.use('/', routes);

// error handler
app.use(error_handler);

const listener = app.listen(config.pub_port, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

