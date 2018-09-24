const { Router } = require('express')
const controller = require('./dashboard.controller')

const { filter } = require('../../../tools/middlewares/auth')

const router = Router()

// 라벨별 통계 조회
router.get('/by-label', filter, controller.byLabel)

// 날짜별 통계 조회
router.get('/by-date', filter, controller.byDate)

module.exports = router
