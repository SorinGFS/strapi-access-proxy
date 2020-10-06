'use strict';

const fs = require('fs');
const defaultHosts = require('./hosts.json');

function jwtHosts({ hosts }) {
    let result = [];
    hosts.forEach((host) => {
        if (host.secretKey || host.privateKeyPath) {
            host.options.secretOrPrivateKey = host.secretKey || fs.readFileSync(host.privateKeyPath);
        }
        if (host.secretKey || host.publicKeyPath) {
            host.options.secretOrPublicKey = host.secretKey || fs.readFileSync(host.publicKeyPath);
        }
        result.push({ hostname: host.hostname, options: Object.assign({}, host.options) });
    });
    console.log(result);
    return result;
}

module.exports = {
    hosts: (hosts) => jwtHosts({ hosts: hosts || defaultHosts }),
};
