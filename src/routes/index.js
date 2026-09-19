const router = require('./router');

const authRoute    = require('./auth.routes');
const profileRoute = require('./profile.routes');

router.use("/api/v1", authRoute);
router.use("/api/v1", profileRoute);

module.exports = router;