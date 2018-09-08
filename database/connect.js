const models = require('./models')

models.sequelize
  .sync({ force: false })
  .then(() => {
  console.log('✓ DB connection success.');
  })
  .catch(err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  })
