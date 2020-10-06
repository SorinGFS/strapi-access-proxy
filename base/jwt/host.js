'use strict';
// Example to refresh tokens using https://github.com/auth0/node-jsonwebtoken
// require('crypto').randomBytes(64).toString('hex')
// in order to be able to verify the token in FRONTEND use RSA keys, because sharing the JWT_SECRET is a security mistake
// there are two ways to extend validity of a token:
// 1 - refresh token
// 2 - sliding expiration of access token (default for this project)
const jwt = require('jsonwebtoken');
const { defaultSecretKey, defaultPrivateKey, defaultPublicKey } = require('../../config/keys');
const defaultSecretOrPrivateKey = defaultSecretKey || defaultPrivateKey;
const defaultSecretOrPublicKey = defaultSecretKey || defaultPublicKey;

const defaultProxiedHost = 'localhost:3000';
const defaultMaxInactivitySeconds = 1800;
const defaultBindCsrs = false;
const defaultAccessLog = 'default';
const defaultAllowOrigins = [];

const defaultSignOptions = {
    // uncommented INVALID props should be provided in custom sign options
    // algorithm: 'HS512',
    // keyid: '1',
    noTimestamp: true,
    // notBefore: '2s',
    // expiresIn: '30m',
    // jwtid: '1',
    // subject: 'req.user.identifier',
    // audience: 'req.hostname', // string, regular expression or list of strings and/or regular expressions
    issuer: process.env.APP_NAME,
    // clockTolerance, clockTimestamp, maxAge, nonce and some more can be used
};

const defaultRefreshOptions = {
    verify: { issuer: process.env.APP_NAME },
    expiresIn: '30d',
};

class JwtHost {
    constructor({ proxiedHost, maxInactivitySeconds, bindCsrs, accessLog, allowOrigins, secretOrPrivateKey, secretOrPublicKey, signOptions, refreshOptions }) {
        this.bindCsrs = bindCsrs || defaultBindCsrs;
        this.accessLog = accessLog || defaultAccessLog;
        this.proxiedHost = proxiedHost || defaultProxiedHost;
        this.allowOrigins = allowOrigins || defaultAllowOrigins;
        this.maxInactivitySeconds = maxInactivitySeconds || defaultMaxInactivitySeconds;
        this.secretOrPrivateKey = secretOrPrivateKey || defaultSecretOrPrivateKey;
        this.secretOrPublicKey = secretOrPublicKey || defaultSecretOrPublicKey;
        this.signOptions = Object.assign({}, defaultSignOptions, signOptions);
        this.refreshOptions = Object.assign({}, defaultRefreshOptions, refreshOptions);
        this.refreshSignOptions = Object.assign({}, this.signOptions, this.refreshOptions);
        delete this.refreshSignOptions.verify;
        console.log(this);
    }
    sign(payload) {
        return jwt.sign(payload, this.secretOrPrivateKey, this.signOptions);
    }
    verify(token) {
        return jwt.verify(token, this.secretOrPublicKey, this.refreshOptions.verify);
    }
    decode(token, decodeOptions) {
        return jwt.decode(token, decodeOptions);
    }
    refresh(token) {
        const payload = this.verify(token);
        // The first signing converted all needed options into claims, they are in the payload
        delete payload.iat;
        delete payload.nbf;
        delete payload.exp;
        delete payload.iss;
        delete payload.aud;
        delete payload.sub;
        delete payload.jti;
        return jwt.sign(payload, this.secretOrPrivateKey, this.refreshSignOptions);
    }
}

module.exports = JwtHost;
