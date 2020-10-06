'use strict';
const rateLimit = require('express-rate-limit');

module.exports = {
    ip: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 1000, // limit each IP to max requests per windowMs // Default 5. Set 0 to disable
        headers: false, // Default true
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip; // this can be modified for more granular control
        },
        message: 'Too many requests from this IP.',
        skip: function (/*req, res*/) {
            return process.env.RATE_LIMIT_IP_ENABLED == 'true' ? false : true;
        },
    }),
    route: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10, // limit each IP to max requests per windowMs // Default 5. Set 0 to disable
        headers: false, // Default true
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip + ':' + req.originalUrl; // this can be modified for more granular control
        },
        message: 'Too many requests from this location.',
        skip: function (/*req, res*/) {
            return process.env.RATE_LIMIT_ROUTE_ENABLED == 'true' ? false : true;
        },
    }),
};
console.log('RATE_LIMIT_IP_ENABLED = ' + process.env.RATE_LIMIT_IP_ENABLED);
console.log('RATE_LIMIT_ROUTE_ENABLED = ' + process.env.RATE_LIMIT_ROUTE_ENABLED);
