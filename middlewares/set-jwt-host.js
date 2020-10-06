'use strict';
// set req jwt host to be used in middlewares
const fn = require('../base/functions');
const jwtHosts = require('../base/jwt/hosts');

function setJwtHost(req, res, next) {
    // fingerprint is used by default, but it can be disabled or misused, for that case we init the prop here
    req.fingerprint = {};
    // jwt host ref (more apropriate serializer may be used, in /base/jwt/hosts too)
    req.jwtHost = jwtHosts[fn.btoa(req.hostname)];
    next();
}

module.exports = setJwtHost;
