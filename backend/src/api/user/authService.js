const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')

//expressão para validar email
const emailRegex = /\S+@\S+\.\S+/
//validação de senha (letras minúsculas, maiúsculas,caracteres especiais, 6-20)
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

//tratar os erros do BD
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

const login = (req, res, next) => {
    //recebendo o email, senha
    const email = req.body.email || ''
    const password = req.body.password || ''
    //procurando o usuário pelo email
    User.findOne({ email }, (err, user) => {

        if (err) {
            return sendErrorsFromDB(res, err)
            //caso encontre, vai fazer uma comparação sicrona a senha com a senha armazenada
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, {
                //duração de 1 dia o login - "token"
                expiresIn: "1 day"
            })

            const { name, email } = user
            res.json({ name, email, token })

        } else {
            //caso tenham algum erro
            return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })

        }
    })
}

//verificando se o token está válido, para o login
const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''
    //validação do email
    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
    }
    //validação da senha
    if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6 - 20."
            ]
        })
    }

    const salt = bcrypt.genSaltSync()
    //gerando hash
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    //procurando o usuário no BD
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ name, email, password: passwordHash })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

module.exports = { login, signup, validateToken }
