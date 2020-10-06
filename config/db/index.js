'use strict';

function options(dbType, dbName) {
    const databases = require('./databases.json');
    const requestedDb = databases.filter((database) => {
        return database.type == dbType && database.dbName == dbName;
    });
    // console.log(requestedDb[0]);
    return requestedDb[0];
}

module.exports = options;
