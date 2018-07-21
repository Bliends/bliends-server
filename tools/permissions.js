exports.checkUserPerm = (user, req) => new Promise((resolve, reject) => {
  if (user._id.toString() === req.user._id.toString()) return resolve(user)
  const err = new Error('권한이 거부되었습니다.')
  err.code = 403
  return reject(err)
})
