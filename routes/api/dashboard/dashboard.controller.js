const { objectRes, errorRes } = require('../../../tools/responses')
const { CL_PAGINATION, checkProperty } = require('../../../tools/validator')
const models = require('../../../database/models')
const Op = models.sequelize.Op

exports.byLabel = async (req, res) => {
  try {

    const { limit, offset } = await checkProperty(CL_PAGINATION, req.query, false)

    const results = await models.activitylog.findAll({
      where: {
        group_id: req.user.group_id,
        label_id: { [Op.ne]: null }
      },
      group: ['label_id'],
      attributes: [
        'label_id',
        [models.sequelize.fn('COUNT', models.sequelize.col('label_id')), 'count']
      ],
      order: [
        [models.sequelize.fn('COUNT', models.sequelize.col('label_id')), 'DESC']
      ],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      include: { model: models.label, as: 'label' }
    })

    return objectRes(200, results, res)

  } catch (err) {
    return errorRes(err, res)
  }
}

exports.byDate = async (req, res) => {
  try {

    const { limit, offset } = await checkProperty(CL_PAGINATION, req.query, false)

    const results = await models.activitylog.findAll({
      where: { group_id: req.user.group_id },
      group: [
        models.sequelize.fn('YEAR', models.sequelize.col('created_at')),
        models.sequelize.fn('MONTH', models.sequelize.col('created_at')),
        models.sequelize.fn('DAY', models.sequelize.col('created_at'))
      ],
      attributes: [
        [models.sequelize.fn('MONTH', models.sequelize.col('created_at')), 'month'],
        [models.sequelize.fn('DAY', models.sequelize.col('created_at')), 'date'],
        [models.sequelize.fn('COUNT', models.sequelize.col('created_at')), 'count'] 
      ],
      order: [
        [models.sequelize.fn('YEAR', models.sequelize.col('created_at')), 'DESC'],
        [models.sequelize.fn('MONTH', models.sequelize.col('created_at')), 'DESC'],
        [models.sequelize.fn('DAY', models.sequelize.col('created_at')), 'DESC']
      ],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    })

    return objectRes(200, results, res)

  } catch (err) {
    return errorRes(err, res)
  }
}