const router = require('./router')
const authController = require('../controllers/auth.controller')
const {verifyToken} = require('../middlewares/verifyToken')

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/user', verifyToken, authController.viewUser)
router.post('/forgetPassword', authController.forgetPass)
router.patch('/resetPassword/:token', authController.resetPass)
module.exports = router
