const router = require('./router')
const authController = require('../controllers/auth.controller')
const viewsController = require('../controllers/views.controller')
const {verifyToken} = require('../middlewares/verifyToken')


router.get('/register', viewsController.viewRegister)
router.post('/register', authController.registerUser)

router.get('/login', viewsController.viewLogin)
router.post('/login', authController.loginUser)
router.get('/login/auth/google', authController.loginGoogle)
router.get('/home', viewsController.viewDashboard)
// router.get('/home', verifyToken, viewsController.viewDashboard)
router.get('/user', verifyToken, authController.viewUser)
router.post('/forgetPassword', authController.forgetPass)
router.patch('/resetPassword/:token', authController.resetPass)
module.exports = router
