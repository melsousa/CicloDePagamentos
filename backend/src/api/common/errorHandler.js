const _ = require('lodash')
const nodeRestful = require('node-restful')

module.exports = (req, res, next) =>{
    const bundle = res.locals.bundle
    const bunErrors = bundle.errors

    if(bunErrors){
        const errors = parseErrors(bunErrors)
        res.status(500).json({errors})
    }else{
        //se não houver um error
        //next vai para o próximo middleware
        next()
    }
}
//tratamento de errors
const parseErrors = (nodeRestfulErrors) =>{
    const errors = []
    //for dentro do atributo error, definido em database
    _.forIn(nodeRestfulErrors, error => errors.push(error.message))
    return errors
}