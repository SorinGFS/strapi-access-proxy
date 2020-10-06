'use strict';

const JwtHost = require('../base/jwt/host');
let accessToken, refreshToken;

const customOptions = {
    // null to use defaults or value to overwrite defaults
    secretOrPrivateKey: null,
    secretOrPublicKey: null,
    signOptions: { issuer: process.env.APP_NAME, audience: 'req.hostname', subject: 'req.user.identifier' },
    // take care: verify must include all requirements HERE, second level assign does not work
    refreshOptions: { verify: { issuer: process.env.APP_NAME, audience: 'req.hostname', subject: 'req.user.identifier' }, expiresIn: '1y', jwtid: 'db.jwtId' },
};

const jwtManager = new JwtHost(customOptions);
accessToken = jwtManager.sign({ id: '5f3f801dd5649218e47127fe', whatever: 'something' });

setTimeout(function () {
    refreshToken = jwtManager.refresh(accessToken);
    console.log(jwtManager.decode(accessToken, { complete: true }));
    console.log(accessToken);
    console.log(jwtManager.decode(refreshToken, { complete: true }));
    console.log(refreshToken);
}, 3000);

// console.log(process.env.SPAM_PROTECTION_ENABLED);
// console.log(process.env.PORT);
// console.log(process.env.MONGO_URI);
// console.log(process.env.NODE_ENV);
