
const express = require('express')

module.exports = function(server){
    //Definir URL base para todas as rotas
    const router = express.Router()
    server.use('/api', router)

    //Rotas de ciclo de pagamento - URL
    const billingCycle = require('../api/billingCycle/billingCycleService')
    billingCycle.register(router, '/billingCycles')
}