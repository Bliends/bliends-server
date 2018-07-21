const handle404 = (req, res) => res.status(404).send({ success: false, message: 'Not found' })

module.exports = handle404
