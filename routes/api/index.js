const { Router } = require('express')

const handle404 = require('../../tools/middlewares/handle404')

const sign = require('./sign')
const user = require('./user')

const router = Router()

router.use('/sign', sign)
router.use('/users', user)
router.use(handle404)

module.exports = router
