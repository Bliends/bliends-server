const validator = require('validator')
const { objectRes, noContentRes, errorRes } = require('../../../tools/responses')
const { CL_LOCATION, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
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

    const validated = await checkProperty(CL_LOCATION, req.body, true)

    validated.latitude = parseFloat(validated.latitude)
    validated.longitude = parseFloat(validated.longitude)

    let location = await models.location.create(validated)

    location.setGroup(group)

    return objectRes(201, location, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.retrieve = async (req, res) => {
  try {

    const location = await models.location.findById(req.params.id)

    if (!location) {
      return raiseError(404, '존재하지 않는 위치기록입니다.')
    }

    return objectRes(200, location, res)

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
    
    const locations = await models.location.findAll({
      where: q,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      order: [['created_at', 'DESC']]
    })

    return objectRes(200, locations, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.delete = async (req, res) => {
  try {

    const location = await models.location.findById(req.params.id)

    if (!location) {
      return raiseError(404, '존재하지 않는 위치기록입니다.')
    }

    const group = await location.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    await location.destroy()

    return noContentRes(res)

  } catch (err) {
    return errorRes(err, res)
  }
}
