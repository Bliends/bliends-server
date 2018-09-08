const { verify } = require('jsonwebtoken')
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
  return res.status(401).send({ success: false, message: 'UNAUTHORIZED' })
}
