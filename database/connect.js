const mongoose = require('mongoose')

const setting = require('../config/db')

const db = mongoose.connection

db.on('error', err => {
  console.error(err)
  console.log('✗ DB connection error. Please make sure DB is running.')
  process.exit()
})

db.once('open', () => {
  console.log('✓ DB connection success.')
})

mongoose.set('debug', setting.DEBUG)

mongoose.connect(
  setting.URL_PATH,
  { useNewUrlParser: true }
)
mongoose.Promise = global.Promise
