'use strict';
// USED AS FALLBACK IF CONFIGURED HOSTS DOES NOT PROVIDE OWN KEYS
const fs = require('fs');
const path = require('path');

const sslKeyBaseDir = process.env.SSL_KEY_BASEDIR || __dirname;
const sslKeyRelativePath = process.env.SSL_KEY_RELATIVE_PATH || 'available';

const privateKeyFileName = process.env.PRIVATE_KEY_FILE;
const publicKeyFileName = process.env.PUBLIC_KEY_FILE;

const privateKeyTarget = path.resolve(sslKeyBaseDir, sslKeyRelativePath, privateKeyFileName);
const publicKeyTarget = path.resolve(sslKeyBaseDir, sslKeyRelativePath, publicKeyFileName);

const privateKeyLink = path.resolve(__dirname, 'enabled', privateKeyFileName);
const publicKeyLink = path.resolve(__dirname, 'enabled', publicKeyFileName);

if (fs.existsSync(privateKeyLink) && fs.lstatSync(privateKeyLink).isSymbolicLink()) {
    fs.unlinkSync(privateKeyLink);
}

if (fs.existsSync(publicKeyLink) && fs.lstatSync(publicKeyLink).isSymbolicLink()) {
    fs.unlinkSync(publicKeyLink);
}

fs.symlinkSync(privateKeyTarget, privateKeyLink);
fs.symlinkSync(publicKeyTarget, publicKeyLink);

module.exports = {
    defaultSecretKey: process.env.JWT_SECRET, // comment this in env fpr RSASHA to be used
    defaultPrivateKey: fs.readFileSync(privateKeyLink), //reading the pem file
    defaultPublicKey: fs.readFileSync(publicKeyLink),
};
