const crypto = require('crypto')

exports.encryptPW = password => crypto
  .createHash('sha512')
  .update(password)
  .digest('base64')
