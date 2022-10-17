const pg                  = require('pg');
const Promise             = require('promise');
const _                   = require('underscore');

const mapper              = require('./mapper');
const pgDaoUtils          = require('./utils');
const pgQueryExtender     = require('./query-extender');

function PostgresSqlDao(options) {
    const _this=this
    if (_.isEmpty(options) || !_.isObject(options)) {
        throw new Error('Options argument is missing or is not an object');
    }
    
    if (_.isEmpty(options.connectTo) || !_.isObject(options.connectTo)) {
        throw new Error('ConnectTo option is missing or is not a string.');
    }
    
    this._connStr = options.connectTo;
    this._instanceFactory = options.instanceFactory || null;
    this._fetchInterceptors = options.interceptors && options.interceptors.fetch ? options.interceptors.fetch : []; 
    return new Promise(function (resolve, reject) {
        (new pg.Pool(options.connectTo)).connect( function (err, client, done) {
            if (err) {
                done();
                reject(err);
                return;
            }
            console.log('DB connected')
            _this.dbConnection = client
            resolve(_this)
        })
    })
}


PostgresSqlDao.prototype.connectTo = function () {
    return this._connStr;
};

PostgresSqlDao.prototype.table = function () {
    return this._table;
};

PostgresSqlDao.prototype.fields = function () {
    return this._fields;
};

PostgresSqlDao.prototype.save = function (entity) {
    let self = this;
    
    let toInsert = {};
    self.fields().forEach(function (field) {
        toInsert[field] = entity[field];
    });
    
    let promise = new Promise(function (resolve, reject) {
        PgGenericDao.insert({
            connectTo: self.connectTo(),
            table: self.table(),
            value: toInsert,
            idField: 'id'
        })
        .then(function (saved) {
            entity.id = saved.id;
            resolve(entity);
        })
        .catch(reject);
    });
    
    return promise;
};

PostgresSqlDao.prototype.find = function (table, fields, id) {
    let self = this;
    
    return new Promise(function (resolve, reject) {
        PostgresSqlDao.queryByFields({
            connectTo: self.connectTo(),
            table: table,
            fields: fields,
            filter: [ 'id', '=', id ]
        })
        .then(function (result) {
            let value;
            
            if (result.length) {
                value = result[0]; 
            }
            else {
                value = null;
            }
            
            self._fetchInterceptors.forEach(function (interceptor) {
                value = interceptor.call(interceptor, self, value);
            });
            
            resolve(value);
        })
        .catch(function (err) {
            reject(err);
        });        
    });
};

PostgresSqlDao.prototype.all = function (options) {
    let self = this;
    options = options || {}; 
    
    let promise = new Promise(function (resolve, reject) {
        PostgresSqlDao.queryByFields({
            connectTo: self.connectTo(),
            table: options.table,
            fields: options.fields,
            filter: options.filter,
            sorting: options.sorting,
            paging: options.paging
        })
        .then(function (result) {
            let i;
            for (i = 0; i < result.length; ++i) {
                self._fetchInterceptors.forEach(function (interceptor) {
                    result[i] = interceptor.call(interceptor, self, result[i]);
                });
            }
            
            resolve(result);
        })
        .catch(reject);
    });
    
    return promise;
};


PostgresSqlDao.rawTransformedQuery = function (options) {
    if (_.isEmpty(options) || !_.isObject(options)) {
        throw new Error('Options argument is missing or is not an object');
    }
    
    return new Promise(function (resolve, reject) {
        // console.log(options)
        (new pg.Pool(options.connectTo)).connect(function (err, client, done) {
            if (err) {
                done();
                reject(err);
                return;
            }
            
            client.query(options.query, options.params, function (err, result) {
                if (err) {
                    done();
                    reject(err);
                    return;
                }
                
                done();
                
                let mappedResult = result.rows.map(
                    function (it) {
                        let nestedObj = mapper.fromFlatObject(it);
                        return mapper.transformKeys(nestedObj, mapper.underscoreToCamelCase);
                    });
                
                resolve(mappedResult);
            });
        });
    });
}

PostgresSqlDao.queryByFields = function (options) {
    if (_.isEmpty(options) || !_.isObject(options)) {
        throw new Error('Options argument is missing or is not an object');
    }
    
    let fieldList = pgDaoUtils.createSelectFieldList(options.fields);
    let query = 'SELECT ' + fieldList + ' FROM "' + options.table + '"';
    let extendedQuery = pgQueryExtender
        .extend(query, options.filter, options.sorting, options.paging);
    return PostgresSqlDao.rawTransformedQuery({
        connectTo: options.connectTo,
        query: extendedQuery.query,
        params: extendedQuery.params
    });
};

module.exports = { PostgresSqlDao };