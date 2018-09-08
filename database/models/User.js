const { encryptPW } = require('../../tools/password')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'user',
    timestamps: true
  })

  user.beforeSave((user, options) => {
    if (user.password.length <= 20) {
      user.password = encryptPW(user.password)
    }
  })

  user.login = async function({ userid, password }) {
    const user = await this.findOne({
      where: {
        userid,
        password: encryptPW(password)
      }
    })
    return user
  }

  return user
}

// const mongoose = require('mongoose')
// const { encryptPW } = require('../../tools/password')

// const Schema = mongoose.Schema

// const userSchema = new Schema(
//   {
//     userid: { type: String, required: true, unique: true },
//     password: { type: String, required: true, select: false },
//     name: { type: String, required: true },
//     type: { type: String, required: true }, // {"patient", "caregiver"}
//     phone: { type: String, unique: true },
//     link: { type: Schema.Types.ObjectId, ref: 'user' }
//   },
//   { timestamps: true, versionKey: false }
// )

// userSchema.pre('save', function (next) {
//   if (this.type === 'C') {
//     this.phone = undefined
//   }
//   next()
// })

// userSchema.methods.comparePassword = function (password) {
//   if (this.password === encryptPW(password)) return true
//   return false
// }

// userSchema.methods.linking = function (user) {
//   this.link = user._id
//   return this.save()
// }

// userSchema.statics.findByUserid = function (userid) {
//   return this.findOne({ userid })
// }

// userSchema.statics.findByPhone = function (phone) {
//   return this.findOne({ phone })
// }

// userSchema.statics.createUser = function (data) {
//   const user = Object.assign(data, { password: encryptPW(data.password) })
//   return new this(user)
// }

// userSchema.statics.updateUser = function (user, data) {
//   const encryptedData = Object.assign(data, { password: encryptPW(data.password), userid: undefined })
//   return Object.assign(user, encryptedData)
// }

// userSchema.statics.login = function ({ userid, password }) {
//   return this.findOne({ userid, password: encryptPW(password) })
// }

// module.exports = mongoose.model('user', userSchema)
