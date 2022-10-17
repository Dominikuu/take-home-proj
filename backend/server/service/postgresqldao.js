const { Pool } = require('pg')
const assert = require('assert');

function PostgresSqlDao( dbName) {
    const _this = this;

    _this.pool = new Pool({
        user: 'admin',
        host: 'postgres',
        database: dbName,
        password: 'password',
        port: 5432,
    })
 
    return new Promise(function(resolve, reject) {
        _this.pool.connect(function(err, client, done) {
            console.log('PostgreSQL is connected');
            done()
            assert.equal(err, null)
            _this.postgresSqlClient = client
            resolve(_this)
        })
    })
}

PostgresSqlDao.prototype.create = async function(tableName, doc = {}) {
    return await this.postgresSqlClient.query(tableName).find(doc).toArray()
}

PostgresSqlDao.prototype.findAll = function(tableName, doc, fn = () => {}) {
    this.postgresSqlClient.query(tableName).find({}).filter(doc).toArray((err, result) => {
        console.log(result)
        console.log('\n')
        fn()
    })
}

PostgresSqlDao.prototype.find = async function(tableName, doc, fn = () => {}) {
    const _this = this;
    return await this.postgresSqlClient.query(tableName).insertOne(doc, (err, result) => {
        console.log(err, doc)
        assert.equal(err, null)
        console.log(result.result.ok + 'INSERT success')
        _this.print(tableName, doc, fn)
        fn()
    })
}

PostgresSqlDao.prototype.update = async function(tableName, filter, doc, fn = () => {}) {
    const _this = this;
    return await this.postgresSqlClient.query(tableName).findOneAndUpdate(filter, { $setOnInsert: doc }, { new: true, upsert: true }, (err, result) => {
        console.log(err, doc)
        console.log(result)
        assert.equal(err, null)
        console.log(result.ok + 'INSERT success')
        _this.print(tableName, doc, fn)
        fn()
    })
}

PostgresSqlDao.prototype.destroy = function(tableName, filter, doc, fn = () => {}) {
    const _this = this;
    this.postgresSqlClient.query(tableName).updateMany(filter, doc, (err, result) => {
        assert.equal(err, null)
        console.log(result.result.ok + 'UPDATE success')
        _this.print(tableName, doc, fn)
        fn()
    })
}

PostgresSqlDao.prototype.createTransaction = function(tableName, doc, fn = () => {}) {
    const _this = this;
    this.postgresSqlClient.query(tableName).deleteOne(doc, (err, result) => {
        assert.equal(err, null)
        console.log(result.result.ok + 'DELETE success')
        fn()
    })
}

module.exports = { PostgresSqlDao };