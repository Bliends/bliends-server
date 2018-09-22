const { Router } = require('express')
const controller = require('./help.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 도움요청 생성
router.post('/', filter, controller.create)

// 도움요청 조회
router.get('/:id', filter, controller.retrieve)

// 도움요청 리스트 조회
router.get('/', controller.read)

// 도움요청 삭제
router.delete('/:id', filter, controller.delete)

module.exports = router
