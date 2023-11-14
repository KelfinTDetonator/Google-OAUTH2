const jwt = require('jsonwebtoken'),
createError = require('http-errors');

module.exports = {
    verifyToken: async(req, res, next) => {
        try {
            const authHeader = req.headers["authorization"] || req.headers["Authorization"]
            const token = (authHeader) ? authHeader.split(" ")[1] : null;

            if(token === null){
                next(createError(401, "Unauthorized"))
            }

            const verifiedPayload = jwt.verify(token, process.env.SECRET_KEY)
            res.user = verifiedPayload
            next();
        } catch (error) {
            console.error(error)
            next(error);
        }
    }
}
