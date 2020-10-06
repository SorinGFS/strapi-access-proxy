'use strict';
const express = require('express');
const router = express.Router();
// _csrf (renamed csrs) cookie is the token secret, not the token
// if the token secret is provided then that key it will be used to generate new token, otherwise new secret is sent
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: { key: 'csrs', secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: true }, value: customValue });
// cookies with sameSite Lax or Strict does solve the csrf problem, but keep in mind:
// ############ cookies are NOT encrypted under the HTTPS protocol ############
// the place where csrfProtection looks for the token, set csrtInHeader in jwt host if frontend validation is desired (also ensure that the frontend passes the cookie to the header)
function customValue(req) {
    if (req.jwtHost.bindCsrs.csrtInHeader) {
        return req.headers[req.jwtHost.bindCsrs.csrtInHeader];
    } else {
        return req.cookies['csrt'];
    }
}
// if csrfProtection passed here means that request method is alowed one
function setInitialCsrfToken(req, res, next) {
    // if req.jwtHost.bindCsrs.csrtInHeader the frontend must copy the value in the specified header
    res.cookie('csrt', req.csrfToken(), { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: true  });
    next();
}

router.use(csrfProtection, setInitialCsrfToken);

module.exports = router;
