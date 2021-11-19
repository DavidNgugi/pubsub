const error_handler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // send error message
    console.log(err)
    res.send(err.message).status(err.status || 500);
}

module.exports = error_handler;