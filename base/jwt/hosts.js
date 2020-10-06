'use strict';

const fn = require('../functions');
const JwtHost = require('./host');
const configJwt = require('../../config/jwt/hosts');
// load default or custom hosts
const hosts = configJwt.hosts();

const jwtHosts = [];
hosts.forEach((host) => {
    jwtHosts[fn.btoa(host.hostname)] = new JwtHost(host.options);
});

module.exports = jwtHosts;