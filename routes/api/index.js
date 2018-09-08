const { Router } = require('express')

const handle404 = require('../../tools/middlewares/handle404')

const sign = require('./sign')
const user = require('./user')
const location = require('./location')

const router = Router()

router.use('/sign', sign)
router.use('/users', user)
router.use('/locations', location)
router.use(handle404)

module.exports = router
