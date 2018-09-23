const validator = require('validator')
const { objectRes, noContentRes, errorRes } = require('../../../tools/responses')
const { CL_ACTIVITYLOG, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
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

    const validated = await checkProperty(CL_ACTIVITYLOG, req.body, true)

    let label = undefined

    validated.label = parseInt(validated.label)
    validated.latitude = parseFloat(validated.latitude)
    validated.longitude = parseFloat(validated.longitude)
    validated.payments = parseInt(validated.payments)

    if (validated.label !== 0) {
      label = await models.label.findById(validated.label)
      if (!label) {
        return raiseError(404, '존재하지 않는 라벨입니다.')
      }
    }

    let activitylog = await models.activitylog.create(validated)

    await activitylog.setGroup(group)

    if (validated.label !== 0) {
      await activitylog.setLabel(label)
    }

    activitylog = await models.activitylog.findOne({
      where: { id: activitylog.id },
      include: { model: models.label, as: 'label' }
    })

    return objectRes(201, activitylog, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.retrieve = async (req, res) => {
  try {

    const activitylog = await models.activitylog.findOne({
      where: { id: req.params.id },
      include: { model: models.label, as: 'label' }
    })

    if (!activitylog) {
      return raiseError(404, '존재하지 않는 활동로그입니다.')
    }

    const group = await activitylog.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    return objectRes(200, activitylog, res)

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
    
    const q_authorized = Object.assign(q, { group_id: req.user.group_id })

    const activitylogs = await models.activitylog.findAll({
      where: q_authorized,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      order: [['created_at', 'DESC']],
      include: { model: models.label, as: 'label' }
    })

    return objectRes(200, activitylogs, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.delete = async (req, res) => {
  try {

    const activitylog = await models.activitylog.findById(req.params.id)

    if (!activitylog) {
      return raiseError(404, '존재하지 않는 라벨입니다.')
    }

    const group = await activitylog.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    await activitylog.destroy()

    return noContentRes(res)

  } catch (err) {
    return errorRes(err, res)
  }
}
