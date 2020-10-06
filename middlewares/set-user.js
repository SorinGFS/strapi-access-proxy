'use strict';
// set req user and permissions if authorization header is present and valid
const express = require('express');
const router = express.Router();
const Permissions = require('../models/Permissions');
const { CustomError } = require('../base/error');

function authenticate(req, res, next) {
    if (req.headers.authorization) {
        // reject if tries relogin
        if (/\/auth/.test(req.path)) {
            res.sendStatus(304);
        }
        // console.log(req.headers.authorization);
        let authHeader = req.headers.authorization.split(' ');
        if (authHeader[0] == 'Bearer') {
            try {
                req.user = req.jwtHost.verify(authHeader[1]);
            } catch (error) {
                if (/expired/.test(error)) {
                    throw new CustomError(401, 'Login expired.', null, 'Unauthorized.');
                } else if (/invalid/.test(error)) {
                    throw new CustomError(403, 'Invalid credentials.', null, 'Forbidden.');
                }
                next(error);
            }
        }
    }
    next();
}

async function setUserPermissions(req, res, next) {
    if (req.user) {
        try {
            const login = { userID: req.user.id, fingerprint: { hash: req.fingerprint.hash } };
            const permission = await Permissions.findOne(login).then((permission) => permission);
            // check request login forgery
            if (permission && req.jwtHost.bindCsrs && permission.csrs !== req.cookies.csrs) {
                throw new CustomError(403, 'Invalid credentials.', null, 'Forbidden.');
            }
            // validate permission (if JWT expiresIn is used expiresAt will not extend that time)
            if (permission && permission.expiresAt > new Date()) {
                Permissions.upsertOne(login, { expiresAt: new Date(Date.now() + req.jwtHost.maxInactivitySeconds * 1000) });
                // no check for expired upstream token, because there it will be checked anyway
                req.headers['Authorization'] = 'Bearer ' + permission.token;
            } else if (permission) {
                Permissions.deleteOne(login);
                throw new CustomError(401, 'Login expired due to inactivity.', null, 'Unauthorized.');
            } else {
                throw new CustomError(403, 'Invalid credentials.', null, 'Forbidden.');
            }
        } catch (error) {
            next(error);
        }
    }
    next();
}

router.use(authenticate, setUserPermissions);

module.exports = router;
