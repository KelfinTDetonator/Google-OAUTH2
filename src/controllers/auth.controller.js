const { users } = require('../models/index')
const { encryptData, verifyData } = require('../../utils/hash.utils'),
response = require('../../utils/response.utils'),
createError = require('http-errors'),
jwt = require('jsonwebtoken'),
mailer = require('../../utils/mailer.utils'),
{ googleAuth } = require('../../utils/passport');
const { error } = require('console');
module.exports = {
    registerUser: async(req, res, next)=>{
        try {
            const {email, password, confirmPass} = req.body

            if(!(email && password && confirmPass)){
                throw createError(400, "Bad syntax")
            }
            const isEmailExist = await users.findUnique({
                where: {
                    email
                }
            });

            if(isEmailExist) throw createError(409, "Account is exist, login to your account instead")
            if(password !== confirmPass) throw createError(403, "Password should match")
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
            // return res.status(200).json(response.success("Login success", token))
            res.redirect(`${req.protocol}://${req.get('host')}/api/v1/home`)
        } catch (error) {
            console.error(error)
            next(error)
        }
    },
    loginGoogle: async(req, res, next)=>{
        try {
            const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_ENDPOINT} = process.env
            const url = `${req.protocol}://${req.get('host')}${CALLBACK_ENDPOINT}`
            const verif = await googleAuth(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, url).authenticate('google', { scope: ['profile', 'email'], failureRedirect: "/login", session: false })
            if(!verif){
                throw error
            }
            console.log(verif);
            const user = req.user
            const token = jwt.sign({user}, process.env.SECRET_KEY)
            next()
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    // oauth2: async(req,res,next)=>{
    //     try {
            
    //     } catch (error) {
    //         next(error)
    //     }
    // },
    forgetPass: async(req, res, next)=>{
        try {
            const MINUTE = process.env.EXP_IN_MINUTE
            const {email} = req.body;
            if(!email){
                throw createError(400, "Bad request")
            }

            const user = await users.findUnique( { where: { email } } );

            if(!user) throw createError(404, "Account is not registered, register first");

            const time = new Date()
            const resetToken = require('crypto').randomBytes(16).toString('hex').concat(time.getTime())           
                                                 //m    //s    //ms
            const expiry = new Date(Date.now() + MINUTE * 60 * 1000)
            console.log(expiry.toString());

            //check if token is exist previously
            const tokenIsExist = (user.resetToken) !== null ? true : false
            if(tokenIsExist){
                throw createError(403, "Please check your email, the token has been sent previously")
            }

            //if not exist
            await users.update({
                where:{
                    id: user.id
                },
                data:{
                    resetToken,
                    resetExp: expiry
                }
            })

            try {
                const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`  
                const subject = `Password Reset request has received.`
                const message = ` Please use the link below to reset your password. Link is valid for ${MINUTE} minutes.\n${resetUrl}`
                await mailer.sendAnEmail(user.email, subject, message) //send to the sender who request reset pass

                return res.json({
                    resetToken,
                    resetExpiration: expiry.toString(),
                    tokenExpiresIn: `${MINUTE} m`
                })

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
            const token = req.params.token.trim();
            const {newPassword, retypedNewPassword} = req.body
            console.log(token.trim());
           
            if(!token){
                throw createError(400, "Bad Request: token is missing");
            }

            const user = await users.findUnique({
                where:{
                    resetToken: token
                }
            })
            
            if(!user) throw createError(404, "Not found");
            console.log(user.resetToken, token);

            const now = new Date(Date.now()).valueOf()
            if(user.resetExp > now){ //while user.resetExp time is still above now() datetime, then...
                if(newPassword === retypedNewPassword){
                    const newPass = await encryptData(newPassword)
                    await users.update({ //change password
                        where:{
                            email: user.email
                        },
                        data:{
                            password: newPass,
                            resetExp: null,
                            resetToken: null,
                        }
                    })

                    return res.status(200).json({
                        expiration: user.resetExp,
                        now,
                        expiredToken: user.resetExp > now ? false : true,
                        message: `Your new password has been set to your account`
                    })
                } else {
                    throw createError(400, "Bad Request")
                }
            } else{
                await users.update({ //reset field in DB after failed to change password
                    where:{
                        email: user.email
                    },
                    data:{
                        resetExp: null,
                        resetToken: null,
                    }
                })
                return res.status(403).json({
                    expiration: user.resetExp,
                    now,
                    expiredToken: user.resetExp > now ? true : false,
                    message: `Your link has been expired. Please try again`
                })
            }

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