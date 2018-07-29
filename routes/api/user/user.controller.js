const validator = require('validator')
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

const checkPhoneConflict = user => new Promise((resolve, reject) => {
  if (!user) return resolve(user)
  const err = new Error('이미 등록 된 전화번호입니다.')
  err.code = 409
  return reject(err)
})

const validateCaregiver = async user => {
  const found = await User.findOne({ type: 'P', phone: user.phone })
  if (found && !found.link) {
    await found.linking(user)
    return user.linking(found)
  }
  const err = new Error(`${found ? '이미 보호자가 등록된' : '존재하지 않는'} 환자입니다.`)
  err.code = found ? 409 : 400
  return Promise.reject(err)
}

exports.create = async (req, res) => {
  try {
    // userid, phone 중복 정보
    const [conflictId, conflictPhone] = await Promise.all([
      User.findByUserid(req.body.userid),
      User.findByPhone(req.body.phone)
    ])

    // 일단 id 중복검사
    await checkUserExist(conflictId, true)

    // 프로퍼티 유효성 검사
    const data = await checkProperty(CL_USER, req.body, true)

    // user 생성
    let user = await User.createUser(data)

    // 생성된 user이 보호자이면 전화번호로 환자와 linking
    if (user.type === 'C') user = await validateCaregiver(user)

    // 환자라면 휴대폰 번호 중복검사
    if (user.type === 'P') await checkPhoneConflict(conflictPhone)

    // user 저장
    await user.save()

    // response
    return userRes(user, res)
  } catch (err) {
    return errorRes(err, res)
  }
}

exports.retreive = async (req, res) => {
  try {
    // user 찾고 있는지 검사
    const user = await User.findById(req.params.id)
    await checkUserExist(user, false)

    // response
    return userRes(user, res)
  } catch (err) {
    return errorRes(err, res)
  }
}

exports.read = async (req, res) => {
  try {
    // limit, offset 받아내기
    const { limit, offset } = await checkProperty(CL_PAGINATION, req.query, false)
    const q = validator.isJSON(req.query.q || '') ? JSON.parse(req.query.q) : {}

    // user 리스트 limit, offset 적용해서 불러오기
    const users = await User.find(q)
      .limit(limit ? parseInt(limit, 10) : 0)
      .skip(offset ? parseInt(offset, 10) : 0)

    // response
    return usersRes(users, res)
  } catch (err) {
    return errorRes(err, res)
  }
}

exports.update = async (req, res) => {
  try {
    // user 찾고
    const found = await User.findById(req.params.id)

    // 존재, 퍼미션 검사
    await checkUserExist(found, false)
    await checkUserPerm(found, req)

    // 수정할려는 데이터 유효성 검사 후 업데이트
    const data = await checkProperty(CL_USER, req.body, false)
    const user = await User.updateUser(req.params.id, data)

    // response
    return userRes(user, res)
  } catch (err) {
    return errorRes(err, res)
  }
}

exports.delete = async (req, res) => {
  try {
    // user 찾고
    const found = await User.findById(req.params.id)

    // 존재, 퍼미션 검사
    await checkUserExist(found, false)
    await checkUserPerm(found, req)

    // 삭제
    const user = await found.remove()

    // response
    return userRes(user, res)
  } catch (err) {
    return errorRes(err, res)
  }
}
