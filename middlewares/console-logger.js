'use strict';
// description
function consoleLogger(req, res, next) {
    // console.log(req.rawHeaders);
    console.log(req.headers);
    // console.log(req.headers['user-agent']);
    // console.log(req.secret);
    console.log(req.signedCookies);
    console.log(req.cookies);
    // console.log(req.ip);
    // console.log(req.ips); // x-forwarded-for, req.ips[0] is the actual client
    console.log(req.originalMethod);
    // console.log(req.originalUrl);
    console.log(req.path);
    console.log(req.query);
    // console.log(req.baseUrl); // mounted path
    // console.log(req.params); // relative to mounted path
    next();
}
module.exports = consoleLogger;
