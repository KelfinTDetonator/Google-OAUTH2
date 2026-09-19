const router = require('./router')
const profileController = require('../controllers/profile.controller')
const { verifyToken } = require('../middlewares/verifyToken')

// Semua route profile membutuhkan autentikasi JWT
router.get('/profile',  verifyToken, profileController.getProfile)
router.post('/profile', verifyToken, profileController.createProfile)
router.put('/profile',  verifyToken, profileController.updateProfile)

module.exports = router
