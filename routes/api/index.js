const { Router } = require('express')

const handle404 = require('../../tools/middlewares/handle404')

const sign = require('./sign')
const user = require('./user')
const group = require('./group')
const label = require('./label')
const activitylog = require('./activitylog')
const help = require('./help')
const dashboard = require('./dashboard')

const router = Router()

router.use('/sign', sign)
router.use('/users', user)
router.use('/groups', group)
router.use('/labels', label)
router.use('/activitylogs', activitylog)
router.use('/helps', help)
router.use('/dashboard', dashboard)
router.use(handle404)

module.exports = router
