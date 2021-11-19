const checkRedis = (client) => {
    // get redis health status
    client.ping(function (err, ping) {
        if (err || (ping !== 'PONG')) {
            return false;
        } else {
            return true;
        }
    });
};
module.exports = {
    checkRedis
};