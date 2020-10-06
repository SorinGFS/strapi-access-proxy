'use strict';
// pasive fingerprinting to be used in conjunction with csrs to identify the request source
var Fingerprint = require('express-fingerprint');
// to enable geoip: cd node_modules/geoip-lite && npm run-script updatedb license_key=YOUR_LICENSE_KEY
const fingerprint = Fingerprint({
    parameters: [
        // Defaults
        Fingerprint.useragent,
        // Fingerprint.acceptHeaders,
        // Fingerprint.geoip,
        // fallback if geoip not available
        function (next, req, res) {
            next(null, {
                ip: req.ip,
                ips: req.ips,
                hostname: req.hostname,
            });
        },
    ],
});

module.exports = fingerprint;
