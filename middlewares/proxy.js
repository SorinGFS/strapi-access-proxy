'use strict';
// description
const expressProxy = require('express-http-proxy');
const Permissions = require('../models/Permissions');
const { CustomError } = require('../base/error');

const proxyOptions = {
    // // alternative for setUser middleware
    // proxyReqOptDecorator: async function (proxyReqOpts, srcReq) {
    //     if (srcReq.headers.authorization) {
    //         let authHeader = srcReq.headers.authorization.split(' ');
    //         if (authHeader[0] == 'Bearer') {
    //             try {
    //                 srcReq.user = srcReq.jwtHost.verify(authHeader[1]);
    //                 // console.log(srcReq.user);
    //                 const login = { userID: srcReq.user.id, fingerprint: { hash: srcReq.fingerprint.hash } };
    //                 const permission = await Permissions.findOne(login).then((permission) => permission);
    //                 // check request login forgery
    //                 if (permission && srcReq.jwtHost.bindCsrs && permission.csrs !== srcReq.cookies.csrs) {
    //                     throw new Error('Invalid credentials.');
    //                 }
    //                 // validate permission (if JWT expiresIn is used expiresAt will not extend that time)
    //                 if (permission && permission.expiresAt > new Date()) {
    //                     Permissions.upsertOne(login,  { expiresAt: new Date(Date.now() + srcReq.jwtHost.maxInactivitySeconds * 1000) });
    //                     proxyReqOpts.headers = { Authorization: 'Bearer ' + permission.token };
    //                 } else if (permission) {
    //                     Permissions.deleteOne(login);
    //                     throw new Error('Login expired due to inactivity.');
    //                 } else {
    //                     throw new Error('Invalid credentials.');
    //                 }
    //             } catch (error) {
    //                 if (/expired/.test(error.message)) {
    //                     res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: error.message });
    //                 } else {
    //                     res.sendStatus(403);
    //                 }
    //             }
    //         }
    //     }
    //     return proxyReqOpts;
    // },
    // userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    //     // recieves an Object of headers, returns an Object of headers.
    //     if (!userReq.user && headers['content-type'] && /json/.test(headers['content-type'])) {
    //         // headers['X-CSRF-Token'] = userReq.csrfToken();
    //         headers['Set-Authorization'] = 'Bearer somhsit';
    //         headers['WWW-Authenticate'] = 'Bearer realm="Access to the staging site", charset="UTF-8"';
    //     }
    //     return headers;
    // },
    userResDecorator: async function (proxyRes, proxyResData, userReq, userRes) {
        if (!userReq.user && proxyRes.headers['content-type'] && /json/.test(proxyRes.headers['content-type'])) {
            const data = JSON.parse(proxyResData.toString('utf8'));
            if (data.jwt) {
                // strapi user token
                if (data.user.audience.split(',').includes(userReq.hostname)) {
                    data.jwt = await authorize(userReq.jwtHost, userReq.cookies.csrs, userReq.fingerprint.hash, data.jwt);
                } else {
                    userRes.sendStatus(400);
                }
            } else if (data.data && data.data.token) {
                // strapi admin token
                data.data.token = await authorize(userReq.jwtHost, userReq.cookies.csrs, userReq.fingerprint.hash, data.data.token);
            } else {
                return proxyResData;
            }
            return JSON.stringify(data);
        } else {
            return proxyResData;
        }
    },
};

async function authorize(jwtHost, csrs, fingerprintHash, token) {
    const payload = jwtHost.decode(token);
    delete payload.iat;
    delete payload.nbf;
    delete payload.exp;
    delete payload.iss;
    delete payload.aud;
    delete payload.sub;
    delete payload.jti;
    // console.log(payload);
    const filter = { userID: payload.id, fingerprint: { hash: fingerprintHash } };
    const update = { token: token, csrs: csrs, issuedAt: new Date(), expiresAt: new Date(Date.now() + jwtHost.maxInactivitySeconds * 1000) };
    Permissions.upsertOne(filter, update);
    return jwtHost.sign(payload);
}

const proxy = expressProxy((req) => {
    return req.jwtHost.proxiedHost;
}, proxyOptions);

module.exports = proxy;
