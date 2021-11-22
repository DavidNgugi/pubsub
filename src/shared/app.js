const express = require('express');
const cors = require('cors');
const error_handler = require('./middleware/error_handler');

// Initialize the app
const express_app = express();

express_app.use(express.json());
express_app.use(cors());

express_app.get('/test/healthcheck', async (req, res) => {
    res.sendStatus(200);
});

const create_app = (routes) => {
    if (routes) {
        express_app.use(routes);
    }

    express_app.use(error_handler);
    return express_app;
};

module.exports = create_app;