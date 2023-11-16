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

    forgetPass: async(req, res, next)=>{
        try {
            const {email} = req.body;
            if(!email){
                throw createError(400, "Bad request")
            }

            const user = await users.findUnique( { where: { email } } );

            if(!user) throw createError(404, "Account is not registered, register first");

            const payload = { id: user.id, email: user.email };
            const resetToken = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '10m'}); //create reset token
            const cryptedResetToken = await encryptData(resetToken)
            
            await users.update({
                where:{
                    id: user.id
                },
                data:{
                    resetToken: cryptedResetToken
                }
            })

            try {
                const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`  
                const msg = `Password Reset request has received. Please use the link below to reset your password`
                await mailer.sendAnEmail(user.email, msg, resetUrl) //send to the sender who request reset pass

                res.status(200).send("Password reset link sent to your email account");

            } catch (error) {
                await users.update({
                    where:{
                        id: user.id
                    },
                    data:{
                        resetToken: null
                    }
                })
                throw createError(500, "There was an error when sending password reset to your email, try again later")
            }
        } catch (error) {
            console.error(error)
            next(error)
        }
    },

    resetPass: async(req, res, next) => {
        try {
            const token = req.params.token.trim()
            console.log(token.trim());
            const isVerified = jwt.verify(token, process.env.SECRET_KEY);

            if(!isVerified){
                throw createError(403, "Forbidden");
            }
            const {id, email} = isVerified;

            const user = await users.findUnique({
                where: {
                    email
                }
            })
            if(!user) throw createError(404, "Not found");
            console.log(user.resetToken, token);

            const tokenIsNewGenerated = await verifyData(token.trim(), user.resetToken)
            console.log(tokenIsNewGenerated);

            if(!tokenIsNewGenerated){
                throw createError(409, "Please use the newest link that sent to your email")
            }

            const {pw} = req.body
            console.log(pw);
            return res.status(201).json(response.success("Reset password succeed"))
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