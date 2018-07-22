const mongoose = require('mongoose')
const { encryptPW } = require('../../tools/password')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    type: { type: String, required: true }, // {"patient", "caregiver"}
    phone: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
)

userSchema.methods.comparePassword = function (password) {
  if (this.password === encryptPW(password)) return true
  return false
}

userSchema.statics.findByUserid = function (userid) {
  return this.findOne({ userid })
}

userSchema.statics.createUser = function (data) {
  const user = Object.assign(data, { password: encryptPW(data.password) })
  return this.create(user)
}

userSchema.statics.updateUser = function (id, data) {
  const user = Object.assign(data, { password: encryptPW(data.password) })
  return this.findByIdAndUpdate(id, user, { new: true })
}

userSchema.statics.login = function ({ userid, password }) {
  return this.findOne({ userid, password: encryptPW(password) })
}

module.exports = mongoose.model('user', userSchema)
