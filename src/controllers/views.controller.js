const response = require('../../utils/response.utils'),
createError = require('http-errors')

module.exports = {
    viewRegister: async (req, res, next) => {
        try {
            res.render('registerForm')
        } catch (error) {
            console.error(error)
            next(error)
        }
    },
    
    viewLogin: async(req, res, next) => {
        try {
            res.render('login')
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}