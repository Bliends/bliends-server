const { sign } = require('jsonwebtoken')
const constants = require('../../../config/constants')
const { tokenRes, userRes, errorRes } = require('../../../tools/responses')

const User = require('../../../database/models/User')

const checkUserExist = user => new Promise((resolve, reject) => {
  if (user) return resolve(user)
  const err = new Error('유효하지 않은 사용자명이나 암호입니다.')
  err.code = 403
  return reject(err)
})

const obtainToken = user => {
  const token = sign({ id: user._id }, constants.JWT_SALT)
  return Promise.resolve(token)
}

exports.login = (req, res) => {
  Promise.resolve(req.body)
    .then(data => User.login(data))
    .then(user => checkUserExist(user))
    .then(user => obtainToken(user))
    .then(token => tokenRes(token, res))
    .catch(err => errorRes(err, res))
}

exports.me = (req, res) => userRes(req.user, res)
