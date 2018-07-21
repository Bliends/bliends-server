const { userRes, usersRes, errorRes } = require('../../../tools/responses')
const { CL_USER, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const { checkUserPerm } = require('../../../tools/permissions')

const User = require('../../../database/models/User')

const checkUserExist = user => new Promise((resolve, reject) => {
  if (user) return resolve(user)
  const err = new Error('존재하지 않는 사용자입니다.')
  err.code = 404
  return reject(err)
})

exports.create = (req, res) => {
  Promise.resolve(req.body)
    .then(body => checkProperty(CL_USER, body, true))
    .then(data => User.create(data))
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}

exports.retreive = (req, res) => {
  Promise.resolve(req.params.id)
    .then(id => User.findById(id))
    .then(user => checkUserExist(user))
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}

exports.read = (req, res) => {
  Promise.resolve(req.query)
    .then(query => checkProperty(CL_PAGINATION, query, true))
    .then(({ limit, offset }) => User.find()
      .limit(parseInt(limit, 10))
      .skip(parseInt(offset, 10)))
    .then(users => usersRes(users, res))
    .catch(err => errorRes(err, res))
}

exports.update = (req, res) => {
  Promise.resolve(req.params.id)
    .then(id => User.findById(id))
    .then(user => checkUserExist(user))
    .then(user => checkUserPerm(user, req))
    .then(() => checkProperty(CL_USER, req.body, false))
    .then(data => User.update(req.params.id, data))
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}

exports.delete = (req, res) => {
  Promise.resolve(req.params.id)
    .then(id => User.findById(id))
    .then(user => checkUserExist(user))
    .then(user => checkUserPerm(user, req))
    .then(user => user.remove())
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}
