const { errorRes } = require('../responses');

const handle404 = (req, res) => {
    const err = new Error('NOT_FOUND')
    err.code = 404
    return errorRes(err, res)
}

module.exports = handle404
