const { users } = require('../models/index')
const { encryptData, verifyData } = require('../../utils/hash.utils'),
response = require('../../utils/response.utils'),
createError = require('http-errors'),
jwt = require('jsonwebtoken'),
mailer = require('../../utils/mailer.utils')

module.exports = {
    registerUser: async(req, res, next)=>{
        try {
            const {email, password} = req.body

            if(!(email && password)){
                throw createError(400, "Bad syntax")
            }
            const isEmailExist = await users.findUnique({
                where: {
                    email
                }
            });

            if(isEmailExist) throw createError(409, "Account is exist, login to your account instead")

            const data = await users.create({
                data:{
                    email,
                    password: await encryptData(password)
                }
            })

            if(!data){
                throw createError(500)
            };

            delete data.password;

            return res.status(201).json(response.success("User created", data))
        } catch (error) {
            console.error(error)
            next(error)
        }
    },
    loginUser: async(req, res, next)=>{
        try {
            const {email, password} = req.body

            if(!(email && password)){
                throw createError(400, "Bad request")
            }

            const user = await users.findUnique( { where: { email } } );

            if(!user) throw createError(404, "Account is not registered, register first")

            const isPassMatch = await verifyData(password, user.password)

            if(!isPassMatch) throw createError(403, "Email or password is incorrect!")

            const payload = { id: user.id, email: user.email }
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })

            return res.status(200).json(response.success("Login success", token))
        } catch (error) {
            console.error(error)
            next(error)
        }
    },
    viewUser: async(req, res, next)=>{
        try {
            const userId = await res.user.id
            const user = await users.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            delete user.password;
            return res.status(200).json(response.success("Fetch data 200 OK", user))
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}