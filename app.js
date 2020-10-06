'use strict';
const env = require('./config/env');
const app = require('express')();
const logger = require('volleyball');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const rateLimit = require('./middlewares/rate-limit');
const slowDown = require('./middlewares/slow-down');
const router = require('./base/router');
// trust Nginx proxy
app.set('trust proxy', true);
// set port
const PORT = process.env.PORT || 7331;
// load logger for dev
if (process.env.NODE_ENV === 'development') {
    app.use(logger);
}
// method override
app.use(methodOverride('method'));
// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
// parse http body forms (if enabled ensure csrfProtection fit the change)
// app.use(require('express').urlencoded({ extended: false }));
// load spam protection
app.use(rateLimit.ip, slowDown.ip, rateLimit.route, slowDown.route);
// route all
app.all('*', router);
app.listen(PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));

module.exports = app;
