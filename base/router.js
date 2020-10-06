'use strict';
const express = require('express');
const router = express.Router();
const Permissions = require('../models/Permissions');
const consoleLogger = require('../middlewares/console-logger');
const performanceTimer = require('../middlewares/performance-timer');
const csrfProtection = require('../middlewares/csrf-protection');
const fingerprint = require('../middlewares/fingerprint');
const setJwtHost = require('../middlewares/set-jwt-host');
const setUser = require('../middlewares/set-user');
const proxy = require('../middlewares/proxy');
const { handleError } = require('./error');

function logout(req, res) {
    if (req.user) {
        const login = { userID: req.user.id, fingerprint: { hash: req.fingerprint.hash } };
        Permissions.deleteOne(login);
    }
    res.sendStatus(401);
}

router.use(/* consoleLogger, performanceTimer, */ setJwtHost, csrfProtection, fingerprint, setUser);
router.all('/logout', logout);
router.use(handleError);
router.all('*', proxy);

module.exports = router;
