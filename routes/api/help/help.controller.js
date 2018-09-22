const validator = require('validator')
const { objectRes, noContentRes, errorRes } = require('../../../tools/responses')
const { CL_HELP, CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const raiseError = require('../../../tools/raise-error')
const models = require('../../../database/models')
const Op = models.sequelize.Op

const fs = require('fs-extra')
const uuidv4 = require('uuid/v4')

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

    const validated = await checkProperty(CL_HELP, req.body, true)

    let filename = null

    if(req.files && req.files.attachments) {
      const file = req.files.attachments
      filename = `${uuidv4()}_${file.name}`
      await fs.ensureDir(`${__dirname}/../../../resources/helps`)
      await file.mv(`${__dirname}/../../../resources/helps/${filename}`)
    }

    validated.latitude = parseFloat(validated.latitude)
    validated.longitude = parseFloat(validated.longitude)
    validated.filename = filename

    let help = await models.help.create(validated)

    await help.setGroup(group)

    return objectRes(201, help, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.retrieve = async (req, res) => {
  try {

    const help = await models.help.findById(req.params.id)

    if (!help) {
      return raiseError(404, '존재하지 않는 도움요청입니다.')
    }

    const group = await help.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    return objectRes(200, help, res)

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

    const helps = await models.help.findAll({
      where: q,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      order: [['created_at', 'DESC']]
    })

    return objectRes(200, helps, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.delete = async (req, res) => {
  try {

    const help = await models.help.findById(req.params.id)
    
    if (!help) {
      return raiseError(404, '존재하지 않는 도움요청입니다.')
    }

    const group = await help.getGroup()

    if (
      group.patient_id !== req.user.id &&
      group.caregiver_id !== req.user.id
    ) {
      return raiseError(403, '권한 거부되었습니다.')
    }

    await help.destroy()

    return noContentRes(res)
    
  } catch (err) {
    return errorRes(err, res)
  }
}