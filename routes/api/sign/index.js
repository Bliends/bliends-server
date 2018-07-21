const { Router } = require('express')
const controller = require('./sign.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 로그인
router.post('/', controller.login)

// 내 정보
router.get('/', filter, controller.me)

module.exports = router
