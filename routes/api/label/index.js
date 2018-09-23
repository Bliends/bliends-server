const { Router } = require('express')
const controller = require('./label.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 라벨 생성
router.post('/', filter, controller.create)

// 라벨 조회
router.get('/:id', filter, controller.retrieve)

// 라벨 리스트 조회
router.get('/', filter, controller.read)

// 라벨 수정
router.patch('/:id', filter, controller.update)

// 라벨 삭제
router.delete('/:id', filter, controller.delete)

module.exports = router
