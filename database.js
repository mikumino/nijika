const { Sequelize } = require('sequelize');

// Create a new instance of sequelize

const sequelize = new Sequelize({ 
    dialect: 'sqlite',
    storage: './log.db',
    models: [__dirname + '/models'],    // not sure if necessary
});

module.exports = sequelize;