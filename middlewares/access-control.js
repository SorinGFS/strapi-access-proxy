'use strict';
// use only if this matter isn't solved at downstream server [draft]

function accessControl(req, res, next) {
    const allowOrigins = req.jwtHost.allowOrigins;
    if (req.method === 'OPTIONS' && allowOrigins) {
        // check if request hostname is included
        if (allowOrigins.includes(req.hostname)) {
            res.headers['Access-Control-Allow-Origin'] = req.hostname;
            res.sendStatus(204);
        } else {
            res.sendStatus(403);
        }
    }
    next();
}

module.exports = accessControl;
