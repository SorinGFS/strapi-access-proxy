'use strict';

const BaseModel = require('../base/model');

class Permissions extends BaseModel {
    constructor() {
        super('permissions');
    }
}

const permissions = new Permissions();

module.exports = permissions;
