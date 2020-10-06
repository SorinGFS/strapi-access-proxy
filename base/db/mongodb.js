'use strict';
const { MongoClient, ObjectID } = require('mongodb');
const config = require('../../config/db')('mongodb');
// Many methods in the MongoDB driver will return a promise if the caller doesn't pass a callback function.
config.getUri = () => {
    let credentials, cluster;
    config.options = config.options || {};
    config.dbName = process.env.MONGO_DB_NAME || config.dbName || process.env.APP_NAME || 'myProject';
    const authDb = process.env.MONGO_AUTH_DB || config.authDb || process.env.APP_NAME;
    const pass = process.env.MONGO_DB_PASS || config.connection.pass;
    const user = process.env.MONGO_DB_USER || config.connection.user;
    const host = process.env.MONGO_DB_HOST || config.connection.host;
    const port = process.env.MONGO_DB_PORT || config.connection.port;
    if (user && pass) {
        credentials = `${user}:${pass}@`;
    }
    if (host && port) {
        cluster = `${host}:${port}/`;
    }
    if (cluster && authDb) {
        return `mongodb://${credentials}${cluster}/${authDb}`;
    }
    return process.env.MONGO_URI || `mongodb://localhost:27017/${authDb}`;
};

async function connect() {
    try {
        const client = await new MongoClient.connect(config.getUri(), config.options);
        if (process.env.NODE_ENV === 'development' && client.isConnected()) { 
            console.log(`Connected MongoDB: ${config.getUri()} database:${config.dbName}`);
        }
        const db = client.db(config.dbName);
        return { db, client, ObjectID };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connect();
