const { Router } = require('express')
const controller = require('./location.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 위치기록 생성
router.post('/', filter, controller.create)

// 위치기록 조회
router.get('/:id', filter, controller.retrieve)

// 위치기록 리스트 조회
router.get('/', filter, controller.read)

// 위치기록 삭제
router.delete('/:id', filter, controller.delete)

module.exports = router
