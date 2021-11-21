const { jsonify } = require('../../shared/utils');

const error_handler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // send error message
    err.status = err.status ? err.status : 500;
    res.send(jsonify(err.message)).status(err.status);
}

module.exports = error_handler;