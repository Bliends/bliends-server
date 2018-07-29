const mongoose = require('mongoose')
const { encryptPW } = require('../../tools/password')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    type: { type: String, required: true }, // {"patient", "caregiver"}
    phone: String,
    link: { type: Schema.Types.ObjectId, ref: 'user' }
  },
  { timestamps: true, versionKey: false }
)

userSchema.methods.comparePassword = function (password) {
  if (this.password === encryptPW(password)) return true
  return false
}

userSchema.methods.linking = function (user) {
  this.link = user._id
  return this.save()
}

userSchema.statics.findByUserid = function (userid) {
  return this.findOne({ userid })
}

userSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone })
}

userSchema.statics.createUser = function (data) {
  const user = Object.assign(data, { password: encryptPW(data.password) })
  return new this(user)
}

userSchema.statics.updateUser = function (user, data) {
  const encryptedData = Object.assign(data, { password: encryptPW(data.password), userid: undefined })
  return Object.assign(user, encryptedData)
}

userSchema.statics.login = function ({ userid, password }) {
  return this.findOne({ userid, password: encryptPW(password) })
}

module.exports = mongoose.model('user', userSchema)
