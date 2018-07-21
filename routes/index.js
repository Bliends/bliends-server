const { Router } = require('express')

const router = Router()

const api = require('./api')

router.use('/api', api)

module.exports = router
