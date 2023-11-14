const router = require('./router');

const authRoute = require('./auth.routes');

router.use("/api/v1", authRoute);

module.exports = router;