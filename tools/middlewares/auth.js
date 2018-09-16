const { verify } = require('jsonwebtoken')
const { errorRes } = require('../responses');
const constants = require('../../config/constants')

const models = require('../../database/models')

function verifyAuth(req) {
  return new Promise((resolve, reject) => {
    verify(req.headers.authorization, constants.JWT_SALT, (err, decoded) => {
      if (err) return reject(err)
      return resolve(decoded.id)
    })
  })
}

exports.auth = (req, res, next) => {
  Promise.resolve(req)
    .then(verifyAuth)
    .then(id => models.user.findById(id))
    .then(user => {
      req.user = user
      return next()
    })
    .catch(err => {
      req.user = undefined
      return next()
    })
}

exports.filter = (req, res, next) => {
  if (req.user) {
    return next()
  }
  const err = new Error('로그인이 필요합니다.')
  err.code = 401
  return errorRes(err, res)
}
