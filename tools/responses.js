exports.userRes = (user, res) => res.send({ success: true, message: 'SUCCESS', user })

exports.usersRes = (users, res) => res.send({ success: true, mssage: 'SUCCESS', users })

exports.tokenRes = (token, res) => res.send({ success: true, message: 'SUCCESS', token })

exports.errorRes = (err, res) => res.status(err.code || 400).send({ success: false, message: err.message })
