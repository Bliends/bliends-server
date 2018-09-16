const { Router } = require('express')
const controller = require('./activitylog.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 활동로그 생성
router.post('/', filter, controller.create)

// 활동로그 조회
router.get('/:id', filter, controller.retrieve)

// 활동로그 리스트 조회
router.get('/', filter, controller.read)

// 활동로그 삭제
router.delete('/:id', filter, controller.delete)

module.exports = router
