exports.objectRes = (code, object, res) => res.status(code || 200).send(object)

exports.noContentRes = res => res.status(204).send()

exports.errorRes = (err, res) => res.status(err.code || 400).send({ message: err.message })
