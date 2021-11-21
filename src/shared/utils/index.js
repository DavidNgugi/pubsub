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

const jsonify = (data) => {
    return { message: data };
};

module.exports = {
    checkRedis,
    jsonify
};