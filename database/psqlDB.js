const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'udemy', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(res => {
    console.log('success: ', res);
  })
  .catch(err => {
    console.log('ERROR: ', err);
  });