const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const fileupload = require('express-fileupload')
const cors = require('cors')

const constants = require('./config/constants')
const routes = require('./routes')

const { auth } = require('./tools/middlewares/auth')
const handle404 = require('./tools/middlewares/handle404')

require('./database/connect')

const app = express()

app.disable('x-powered-by')

app.use(logger(constants.LOG_FORMAT))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use('/uploads', express.static(`${__dirname}/resources`))
app.use(fileupload())
app.use(cors())

app.use(auth)
app.use(routes)

app.listen(constants.PORT, () => {
  console.log(`Server listen to port: ${constants.PORT}`)
})
