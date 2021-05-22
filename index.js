'use strict';
// proxy plugin
const createError = require('http-errors');
// proxy options for strapi
module.exports = {
    // // alternative for setUser middleware
    // proxyReqOptDecorator: async function (proxyReqOpts, srcReq) {
    //     if (srcReq.headers.authorization) {
    //         let authHeader = srcReq.headers.authorization.split(' ');
    //         if (authHeader[0] == 'Bearer') {
    //             try {
    //                 srcReq.user = srcReq.server.auth.jwt.verify(authHeader[1]);
    //                 // console.log(srcReq.user);
    //                 const login = { userID: srcReq.user.id, fingerprint: { hash: srcReq.fingerprint.hash } };
    //                 const permission = await Permissions.findOne(login).then((permission) => permission);
    //                 // check request login forgery
    //                 if (permission && srcReq.server.auth.bindCsrs && permission.csrs !== srcReq.cookies.csrs) {
    //                     next(createError(403, 'Invalid credentials.'));
    //                 }
    //                 // validate permission (if JWT expiresIn is used expiresAt will not extend that time)
    //                 if (permission && permission.expiresAt > new Date()) {
    //                     Permissions.upsertOne(login, { expiresAt: new Date(Date.now() + srcReq.server.auth.maxInactivitySeconds * 1000) });
    //                     proxyReqOpts.headers = { Authorization: 'Bearer ' + permission.token };
    //                 } else if (permission) {
    //                     Permissions.deleteOne(login);
    //                     next(createError(401, 'Login expired due to inactivity.'));
    //                 } else {
    //                     next(createError(403, 'Invalid credentials.'));
    //                 }
    //             } catch (error) {
    //                 next(error);
    //             }
    //         }
    //     }
    //     return proxyReqOpts;
    // },
    // userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    //     // recieves an Object of headers, returns an Object of headers.
    //     if (!userReq.user && headers['content-type'] && /json/.test(headers['content-type'])) {
    //         // headers['X-CSRF-Token'] = userReq.csrfToken();
    //         headers['Set-Authorization'] = 'Bearer own-token';
    //         headers['WWW-Authenticate'] = 'Bearer realm="Access to the staging site", charset="UTF-8"';
    //     }
    //     return headers;
    // },
    userResDecorator: async function (proxyRes, proxyResData, userReq, userRes) {
        if (!userReq.user && proxyRes.headers['content-type'] && /json/.test(proxyRes.headers['content-type'])) {
            const data = JSON.parse(proxyResData.toString('utf8'));
            let login;
            if (data.jwt) {
                // strapi user token
                // if user audience not defined in Strapi User means the user have access to all hosts managed by that strapi instalation (if mode than ome exists)
                if (!data.user.audience || data.user.audience.split(',').includes(userReq.hostname)) {
                    login = await userReq.server.auth.jwt.login(userReq, data.jwt);
                    data.jwt = login.jwt;
                    if (login.refresh) data.refresh = login.refresh;
                } else {
                    return next(createError(403, 'Forbidden origin.'));
                }
            } else if (data.data && data.data.token) {
                // strapi admin token
                login = await userReq.server.auth.jwt.login(userReq, data.data.token);
                data.data.token = login.jwt;
                if (login.refresh) data.data.refresh = login.refresh;
            } else {
                return proxyResData;
            }
            return JSON.stringify(data);
        } else {
            return proxyResData;
        }
    },
};
