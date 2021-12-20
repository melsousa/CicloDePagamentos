const BillingCycle = require('./billingCycle')
const errorHandler = require('../common/errorHandler')

BillingCycle.methods(['get', 'post', 'put', 'delete'])
BillingCycle.updateOptions({new: true, runValidators: true}) //vai retornar o valor atualizado (new)
                                                     //vai aplicar as validações (runValidators)
BillingCycle.after('post', errorHandler).after('put', errorHandler)
                                                     
BillingCycle.route('count', (req, res, next)=>{
    BillingCycle.count((error, value) =>{
        if(error){
            res.status(500).json({errors:[error]})
        }else{
            res.json({value})
        }
    })
})
//método ----- ordem req,res,next                                        
BillingCycle.route('summary', (req, res, next) => {
    BillingCycle.aggregate([{ 
        //comandos do MongoDB
        //project vai extrair apenas o valor necessário ex: credits
        //somando todos os creditos e debitos
        $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}} 
    }, { 
        //vai agrupar todos os valores de todos os registros
        $group: {_id: null, credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
    }, { 
        //o id não vai aparecer
        $project: {_id: 0, credit: 1, debt: 1}
        }], (error, result) => {
            if(error) {
                res.status(500).json({errors: [error]})
            } else {
                //caso não tenha a agregação de valores, vai retornar zerado
                res.json(result[0] || {credit: 0, debt: 0})
            }
        })
})

module.exports = BillingCycle