const bcrypt = require('bcrypt')

module.exports = {
    hashPass: async function(data){
        try {
            if(typeof data !== 'string'){
                throw new Error("Wrong data type")
            }
            const salt = await bcrypt.genSalt();
            return bcrypt.hash(data, salt)
        } catch (error) {
            throw error
        }
    },
    verifyPassword: async function(data, encryptedData){
        try {
            if(typeof data !== 'string'){
                throw new Error("Wrong data type")
            }

            return bcrypt.compare(data, encryptedData)
        } catch (error) {
            throw error
        }
    }
}