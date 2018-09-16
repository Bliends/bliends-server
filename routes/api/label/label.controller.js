const validator = require('validator')
const { objectRes, noContentRes, errorRes } = require('../../../tools/responses')
const { CL_LABEL, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const raiseError = require('../../../tools/raise-error')
const models = require('../../../database/models')
const Op = models.sequelize.Op

exports.create = async (req, res) => {
  try {

    const group = await models.group.findOne({
      where: {
        [Op.or]: [
          { patient_id: req.user.id },
          { caregiver_id: req.user.id }
        ]
      }
    })

    if (!group) {
      return raiseError(404, '아직 그룹이 생성되지 않았습니다.')
    }

    const validated = await checkProperty(CL_LABEL, req.body, true)

    validated.latitude = parseFloat(validated.latitude)
    validated.longitude = parseFloat(validated.longitude)
    validated.importance = parseInt(validated.importance)

    let label = await models.label.create(validated)

    await label.setGroup(group)

    return objectRes(201, label, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.retrieve = async (req, res) => {
  try {

    const label = await models.label.findById(req.params.id)

    if (!label) {
      return raiseError(404, '존재하지 않는 라벨입니다.')
    }

    return objectRes(200, label, res)

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
    
    const labels = await models.label.findAll({
      where: q,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      order: [['created_at', 'DESC']]
    })

    return objectRes(200, labels, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.update = async (req, res) => {
try {

    const label = await models.label.findById(req.params.id)

    if (!label) {
      return raiseError(404, '존재하지 않는 라벨입니다.')
    }

    const group = await label.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    const validated = await checkProperty(CL_LABEL, req.body, false)

    validated.latitude = parseFloat(validated.latitude || label.latitude)
    validated.longitude = parseFloat(validated.longitude || label.longitude)
    validated.importance = parseInt(validated.importance || label.importance)

    await label.update(validated)

    return objectRes(200, label, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.delete = async (req, res) => {
  try {

    const label = await models.label.findById(req.params.id)

    if (!label) {
      return raiseError(404, '존재하지 않는 라벨입니다.')
    }

    const group = await label.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    await label.destroy()

    return noContentRes(res)

  } catch (err) {
    return errorRes(err, res)
  }
}
