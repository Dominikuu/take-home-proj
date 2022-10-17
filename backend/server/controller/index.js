const { get } = require('lodash')
const _ = require('underscore');

const listAllSalary = async (req, res, next, dbDao) => {
    const OPERATOR = {
        'gte': '>=',
        'gt': '>',
        'lt': '<',
        'lte': '<=',
        'ne': '!=',
        'eq': '='
    }
    const allowedFields = ['jobTitle', 'yearExp']
    const {fields, sort, sortType} = req.query
    const sortArray = sort? sort.split(','): []
    const sortTypeArray = sortType? sortType.split(','): []
    const fieldsArray = fields? fields.split(','): []

    const filtering = []
    for (const field of allowedFields) {
        const query_field = get(req, `query.${field}`)
        if (query_field) {
            if (_.isObject(query_field)) {
                const key = Object.keys(query_field)[0]
                const value = isNaN? query_field[key] :parseInt(query_field[key])
                filtering.push([field, OPERATOR[key], value])
            } else {
                filtering.push([field, OPERATOR.eq, query_field])
            }
        }
    }
    const sorting = sortArray.map((field, idex)=>{
        return {field, direction: sortTypeArray[idex]}
    })

    const queryOption = {
        table: 'salary',    
    }
    if (fieldsArray.length) {
        queryOption['fields']= fieldsArray
    }
    if (filtering.length) {
        queryOption['filter']= ['$and', ...filtering]
    }
    if (sorting.length) {
        queryOption['sorting']= sorting
    }
    const results = await dbDao.all(queryOption)
    res.setHeader("Content-Type", "application/json");
    return res
    .status(200)
    .json(results);
  
}

const findOneSalary = async (req, res, next, dbDao) => {
    const {id} = req.params
    const allowedFields = ['jobTitle', 'yearExp']
    const {fields} = req.query
    const fieldsArray = fields? fields.split(','): []
    const queryOption = {
        table: 'salary',    
    }
    if (fieldsArray.length) {
        queryOption['fields']= fieldsArray
    }
    
    queryOption['id']= id
    try {
        const results = await dbDao.find(queryOption)
        res.setHeader("Content-Type", "application/json");
        return res
        .status(200)
        .json(results);
    } catch(err){
        return res
        .status(400)
        .json(err);
    }
  
}
module.exports = Object.assign({}, {
    listAllSalary,
    findOneSalary
});