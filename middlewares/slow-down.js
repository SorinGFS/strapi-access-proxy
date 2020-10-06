'use strict';
const slowDown = require('express-slow-down');

module.exports = {
    ip: slowDown({
        windowMs: 2 * 60 * 1000, // 2 minutes
        delayAfter: 500, // allow requests per windowMs, then...
        delayMs: 10, // begin adding delay per request above delayAfter
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip; 
        },
        skip: function (/*req, res*/) {
            return process.env.SLOW_DOWN_IP_ENABLED == 'true' ? false : true;
        },
    }),
    route: slowDown({
        windowMs: 2 * 60 * 1000, // 2 minutes
        delayAfter: 5, // allow requests per windowMs, then...
        delayMs: 1400, // begin adding delay per request above delayAfter
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip + ':' + req.originalUrl; // this can be modified for more granular control
        },
        skip: function (/*req, res*/) {
            return process.env.SLOW_DOWN_ROUTE_ENABLED == 'true' ? false : true;
        },
    }),
};
console.log('SLOW_DOWN_IP_ENABLED = ' + process.env.SLOW_DOWN_IP_ENABLED);
console.log('SLOW_DOWN_ROUTE_ENABLED = ' + process.env.SLOW_DOWN_ROUTE_ENABLED);
