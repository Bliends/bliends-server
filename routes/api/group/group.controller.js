const validator = require('validator')
const { objectRes, errorRes } = require('../../../tools/responses')
const { CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const raiseError = require('../../../tools/raise-error')
const models = require('../../../database/models')

exports.retrieve = async (req, res) => {
  try {

    const group = await models.group.findOne({
      where: { id: req.params.id },
      include: [
        { model: models.user, as: 'petient' },
        { model: models.user, as: 'caregiver' }
      ]
    })

    if (!group) {
      return raiseError(404, '존재하지 않는 그룹입니다.')
    }

    return objectRes(200, group, res)

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
    
    const groups = await models.group.findAll({
      where: q,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      order: [['created_at', 'DESC']],
      include: [
        { model: models.user, as: 'patient' },
        { model: models.user, as: 'caregiver' }
      ]
    })

    return objectRes(200, groups, res)

  } catch (err) {
    return errorRes(err, res)
  }
}
