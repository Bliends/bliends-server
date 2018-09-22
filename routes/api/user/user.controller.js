const validator = require('validator')
const { objectRes, noContentRes, errorRes } = require('../../../tools/responses')
const { CL_USER, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const raiseError = require('../../../tools/raise-error')
const models = require('../../../database/models')

exports.create = async (req, res) => {
  try {

    const validated = await checkProperty(CL_USER, req.body, true)

    const [conflictId, conflictPhone] = await Promise.all([
      models.user.findOne({ where: { userid: validated.userid }}),
      models.user.findOne({ where: { phone: validated.phone }})
    ])
    
    if (conflictId) {
      return raiseError(409, '이미 등록된 ID입니다.')
    }

    let user = models.user.build(validated)

    if (validated.type === 'C') {

      const patient = await models.user.findOne({
        where: {
          type: 'P',
          phone: user.phone
        }
      })

      if (!patient) {
        return raiseError(404, '존재하지 않는 사용자(환자)입니다.')
      }

      const matched = await models.group.findOne({
        where: {
          patient_id: patient.id
        }
      })

      if (matched) {
        return raiseError(409, '이미 보호자가 매칭된 사용자(환자)입니다.')
      }

      user = await user.save()
      const group = await models.group.create({})
      group.setPatient(patient)
      group.setCaregiver(user)

    } else if (validated.type === 'P') {

      if(conflictPhone) {
        return raiseError(409, '이미 등록된 전화번호입니다.')
      }

      user = await user.save()

    }
    
    return objectRes(201, user, res)

  } catch (err) {
    return errorRes(err, res) 
  }
}

exports.retrieve = async (req, res) => {
  try {

    const user = await models.user.findById(req.params.id)

    if (!user) {
      return raiseError(404, '존재하지 않는 사용자입니다.')
    }

    return objectRes(200, user, res)

  } catch (err) {
    return errorRes(err, res) 
  }
}

exports.read = async (req, res) => {
  try {

    const { limit, offset } = await checkProperty(CL_PAGINATION, req.query, false)
    
    if ((req.query && req.query.q) && !validator.isJSON(req.query.q)) {
      raiseError(400, '올바른 JSON 포맷이 아닙니다. in Request params \'q\'')
    }

    const q = JSON.parse((req.query && req.query.q) ? req.query.q : '{}')
    
    const users = await models.user.findAll({
      where: q,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    })

    return objectRes(200, users, res)

  } catch (err) {
    return errorRes(err, res) 
  }
}

exports.update = async (req, res) => {
  try {

    let user = await models.user.findById(req.params.id)

    if (!user) {
      return raiseError(404, '존재하지 않는 사용자입니다.')
    }

    if (user.id !== req.user.id) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    const validated = await checkProperty(CL_USER, req.body, false)

    validated.phone = user.phone
    validated.type = user.type

    await user.update(validated)

    return objectRes(200, user, res)

  } catch (err) {
    return errorRes(err, res) 
  }
}

exports.delete = async (req, res) => {
  try {

    let user = await models.user.findById(req.params.id)

    if (!user) {
      return raiseError(404, '존재하지 않는 사용자입니다.')
    }

    if (user.id !== req.user.id) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    await user.destroy()

    return noContentRes(res)

  } catch (err) {
    return errorRes(err, res) 
  }
}
