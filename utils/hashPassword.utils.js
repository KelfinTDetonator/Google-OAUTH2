const bcrypt = require('bcrypt')

module.exports = {
    hashPass: async function(password){
        try {
            const salt = await bcrypt.genSalt();
            return bcrypt.hash(password, salt)
        } catch (error) {
            console.error(error)
            throw Error(error)
        }
    }
}