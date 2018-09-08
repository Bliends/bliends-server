module.exports = (code, message) => {
  const err = new Error(message)
  err.code = code
  throw err
}