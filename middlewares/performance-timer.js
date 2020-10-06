'use strict';
// description
const fn = require('../base/functions');

const performanceTimer = (req, res, next) => {
    let start = fn.microtime(true);
    next();
    let end = fn.microtime(true);
    console.log(`[PERF]: (<—> ${Math.round((end - start) * 1000.0) } ms)`);
};

module.exports = performanceTimer;
