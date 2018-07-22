const { Router } = require('express')
const controller = require('./user.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 사용자 생성
router.post('/', controller.create)

// 사용자 조회
router.get('/:id', controller.retreive)

// 사용자 리스트 조회
router.get('/', controller.read)

// 사용자 수정
router.patch('/:id', filter, controller.update)

// 사용자 삭제
router.delete('/:id', filter, controller.delete)

module.exports = router
