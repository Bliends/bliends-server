const config = {
  development: {
    username: 'root',
    password: 'Asdf!234',
    database: 'bliends',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    timezone: 'Asia/Seoul',
    dialectOptions: {
      dateStrings: true,
      typeCast: (field, next) => {
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    }
  }
}

module.exports = config
