const { userRes, usersRes, errorRes } = require('../../../tools/responses')
const { CL_USER, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const { checkUserPerm } = require('../../../tools/permissions')

const User = require('../../../database/models/User')

const checkUserExist = (user, isNot) => new Promise((resolve, reject) => {
  // isNot : 없으면 통과여부
  if (isNot ? !user : user) return resolve(user)

  // 사용자가 없어야하는데 에러라면?
  const err = new Error(`${isNot ? '이미 존재하는' : '존재하지 않는'} 사용자입니다.`)
  err.code = isNot ? 409 : 404
  return reject(err)
})

exports.create = (req, res) => {
  Promise.resolve(req.body.userid)
    .then(userid => User.findByUserid(userid))
    .then(user => checkUserExist(user, true))
    .then(() => checkProperty(CL_USER, req.body, true))
    .then(data => User.createUser(data))
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}

exports.retreive = (req, res) => {
  Promise.resolve(req.params.id)
    .then(id => User.findById(id))
    .then(user => checkUserExist(user, false))
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
    .then(user => checkUserExist(user, false))
    .then(user => checkUserPerm(user, req))
    .then(() => User.findByUserid(req.body.userid))
    .then(user => checkUserExist(user, true))
    .then(() => checkProperty(CL_USER, req.body, false))
    .then(data => User.updateUser(req.params.id, data))
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}

exports.delete = (req, res) => {
  Promise.resolve(req.params.id)
    .then(id => User.findById(id))
    .then(user => checkUserExist(user, false))
    .then(user => checkUserPerm(user, req))
    .then(user => user.remove())
    .then(user => userRes(user, res))
    .catch(err => errorRes(err, res))
}
