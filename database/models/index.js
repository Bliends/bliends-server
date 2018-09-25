"use strict"

var fs        = require("fs")
var path      = require("path")
var Sequelize = require("sequelize")
var env       = process.env.NODE_ENV || "development"
var config    = require('../config')[env]
var sequelize = new Sequelize(config.database, config.username, config.password, config)
var db        = {}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js")
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// groups has 2 users
db.group.belongsTo(db.user, { as: 'patient' })
db.group.belongsTo(db.user, { as: 'caregiver' })

// group has many chats
db.label.belongsTo(db.group, { as: 'group' })
db.group.hasMany(db.label, { as: 'labels' })

// group has many location infos
db.activitylog.belongsTo(db.group, { as: 'group' })
db.group.hasMany(db.activitylog, { as: 'activitylogs' })

// activitylog have a label
db.activitylog.belongsTo(db.label, { as: 'label' })
db.label.hasMany(db.activitylog, { as: 'activitylogs' })

// help request have a group
db.help.belongsTo(db.group, { as: 'group' })
db.group.hasMany(db.help, { as: 'helps' })

module.exports = db