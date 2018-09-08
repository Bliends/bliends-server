const { sign } = require('jsonwebtoken')
const constants = require('../../../config/constants')
const { objectRes, errorRes } = require('../../../tools/responses')

const models = require('../../../database/models')

const checkUserExist = user => new Promise((resolve, reject) => {
  if (user) return resolve(user)
  const err = new Error('유효하지 않은 사용자명이나 암호입니다.')
  err.code = 403
  return reject(err)
})

const obtainToken = user => {
  const token = sign({ id: user.id }, constants.JWT_SALT)
  return Promise.resolve(token)
}

exports.login = (req, res) => {
  Promise.resolve(req.body)
    .then(data => models.user.login(data))
    .then(user => checkUserExist(user))
    .then(user => obtainToken(user))
    .then(token => objectRes(200, { token }, res))
    .catch(err => errorRes(err, res))
}

exports.me = (req, res) => objectRes(200, req.user, res)
