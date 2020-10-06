'use strict';

class Model {
    constructor(collection) {
        this.collection = collection;
        this.connect();
    }
    async connect() {
        await require('./db/mongodb').then((connection) => Object.assign(this, connection));
    }
    async close() {
        await this.client.close();
    }
    async findByID(id, callBack) {
        return await this.db.collection(this.collection).findOne({ _id: new this.ObjectID(id) }, callBack);
    }
    async findOne(filter, callBack) {
        return await this.db.collection(this.collection).findOne({ ...filter }, callBack);
    }
    async findAll(callBack) {
        return await this.db.collection(this.collection).find({}).toArray(callBack);
    }
    async countAll(callBack) {
        return await this.db.collection(this.collection).countDocuments({}, callBack);
    }
    async count(filter, callBack) {
        return await this.db.collection(this.collection).countDocuments({ ...filter }, callBack);
    }
    async insertByID(id, item, callBack) {
        return await this.db.collection(this.collection).insertOne({ _id: new this.ObjectID(id), ...item }, callBack);
    }
    async insertOne(item, callBack) {
        return await this.db.collection(this.collection).insertOne({ ...item }, callBack);
    }
    async delete(filter, callBack) {
        return await this.db.collection(this.collection).deleteMany({ ...filter }, callBack);
    }
    async deleteByID(id, callBack) {
        return await this.db.collection(this.collection).deleteOne({ _id: new this.ObjectID(id) }, callBack);
    }
    async deleteOne(filter, callBack) {
        return await this.db.collection(this.collection).deleteOne({ ...filter }, callBack);
    }
    async update(filter, update, callBack) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, callBack);
    }
    async updateByID(id, update, callBack) {
        return await this.db.collection(this.collection).updateOne({ _id: new this.ObjectID(id) }, { $set: { ...update } }, callBack);
    }
    async updateOne(filter, update, callBack) {
        return await this.db.collection(this.collection).updateOne({ ...filter }, { $set: { ...update } }, callBack);
    }
    async upsert(filter, update, callBack) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, { upsert: true }, callBack);
    }
    async upsertByID(id, update, callBack) {
        return await this.db.collection(this.collection).findOneAndUpdate({ _id: new this.ObjectID(id) }, { $set: { ...update } }, { upsert: true }, callBack);
    }
    async upsertOne(filter, update, callBack) {
        return await this.db.collection(this.collection).findOneAndUpdate({ ...filter }, { $set: { ...update } }, { upsert: true }, callBack);
    }
}

module.exports = Model;
