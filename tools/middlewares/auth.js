const { verify } = require('jsonwebtoken')
const { errorRes } = require('../responses');
const constants = require('../../config/constants')
const raiseError = require('../../../tools/raise-error')

const models = require('../../database/models')

function verifyAuth(req) {
  return new Promise((resolve, reject) => {
    verify(req.headers.authorization, constants.JWT_SALT, (err, decoded) => {
      if (err) return reject(err)
      return resolve(decoded.id)
    })
  })
}

exports.auth = async (req, res, next) => {
  try {

    const id = verifyAuth(req)

    const user = await models.user.findById(id)

    if (!user) {
      return raiseError(0, '')
    }

    const group = await models.group.findOne({
      where: {
        patient_id: user.id,
        caregiver_id: user.id
      }
    })

    user.group_id = group ? group.id : null

    req.user = user
    return next()

  } catch (err) {
    req.user = undefined
    return next()
  }
}

exports.filter = (req, res, next) => {
  if (req.user) {
    return next()
  }
  const err = new Error('로그인이 필요합니다.')
  err.code = 401
  return errorRes(err, res)
}
