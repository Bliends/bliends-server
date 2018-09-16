const { Router } = require('express')
const controller = require('./group.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 그룹 조회
router.get('/:id', filter, controller.retrieve)

// 그룹 리스트 조회
router.get('/', filter, controller.read)

module.exports = router
