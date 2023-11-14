const bcrypt = require('bcrypt')

module.exports = {
    hashPass: async function(password){
        try {
            if(typeof password !== 'string'){
                throw new Error("Wrong password data type")
            }
            const salt = await bcrypt.genSalt();
            return bcrypt.hash(password, salt)
        } catch (error) {
            throw error
        }
    },
    verifyPassword: async function(password, encryptedPass){
        try {
            if(typeof password !== 'string'){
                throw new Error("Wrong password data type")
            }

            return bcrypt.compare(password, encryptedPass)
        } catch (error) {
            throw error
        }
    }
}