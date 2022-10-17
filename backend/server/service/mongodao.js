const { MongoClient } = require('mongodb')
const assert = require('assert');

function MongoDao(mongoUri, dbName) {
    const _this = this;
    const option = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    _this.mongoClient = new MongoClient(mongoUri, option)
    return new Promise(function(resolve, reject) {
        _this.mongoClient.connect(function(err, client) {
            assert.equal(err, null)
            console.log('mongodb is connected');
            _this.dbConnection = _this.mongoClient.db(dbName)
            resolve(_this)
        })
    })
}

MongoDao.prototype.read = async function(collectionName, doc = {}) {
    return await this.dbConnection.collection(collectionName).find(doc).toArray()
}

MongoDao.prototype.print = function(collectionName, doc, fn = () => {}) {
    this.dbConnection.collection(collectionName).find({}).filter(doc).toArray((err, result) => {
        console.log(result)
        console.log('\n')
        fn()
    })
}

MongoDao.prototype.insert = async function(collectionName, doc, fn = () => {}) {
    const _this = this;
    return await this.dbConnection.collection(collectionName).insertOne(doc, (err, result) => {
        console.log(err, doc)
        assert.equal(err, null)
        console.log(result.result.ok + 'INSERT success')
        _this.print(collectionName, doc, fn)
        fn()
    })
}

MongoDao.prototype.findOrCreate = async function(collectionName, filter, doc, fn = () => {}) {
    const _this = this;
    return await this.dbConnection.collection(collectionName).findOneAndUpdate(filter, { $setOnInsert: doc }, { new: true, upsert: true }, (err, result) => {
        console.log(err, doc)
        console.log(result)
        assert.equal(err, null)
        console.log(result.ok + 'INSERT success')
        _this.print(collectionName, doc, fn)
        fn()
    })
}

MongoDao.prototype.update = function(collectionName, filter, doc, fn = () => {}) {
    const _this = this;
    this.dbConnection.collection(collectionName).updateMany(filter, doc, (err, result) => {
        assert.equal(err, null)
        console.log(result.result.ok + 'UPDATE success')
        _this.print(collectionName, doc, fn)
        fn()
    })
}

MongoDao.prototype.delete = function(collectionName, doc, fn = () => {}) {
    const _this = this;
    this.dbConnection.collection(collectionName).deleteOne(doc, (err, result) => {
        assert.equal(err, null)
        console.log(result.result.ok + 'DELETE success')
        fn()
    })
}

module.exports = { MongoDao };