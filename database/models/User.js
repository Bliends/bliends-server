const mongoose = require('mongoose')
const { encryptPW } = require('../../tools/password')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false }
  },
  { timestamps: true, versionKey: false }
)

userSchema.methods.comparePassword = function (password) {
  if (this.password === encryptPW(password)) return true
  return false
}

userSchema.statics.create = function (data) {
  const user = Object.assign(data, { password: encryptPW(data.password) })
  return this.create(user)
}

userSchema.statics.update = function (id, data) {
  const user = Object.assign(data, { password: encryptPW(data.password) })
  return this.findByIdAndUpdate(id, user, {})
}

userSchema.statics.login = function ({ username, password }) {
  return this.findOne({ username, password: encryptPW(password) })
}

module.exports = mongoose.model('user', userSchema)
