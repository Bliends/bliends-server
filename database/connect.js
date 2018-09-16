const models = require('./models')
const { DB_RESET } = require('../config/constants')

models.sequelize
  .sync({ force: DB_RESET })
  .then(() => {
  console.log('✓ DB connection success.');
  })
  .catch(err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  })
