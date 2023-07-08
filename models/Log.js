const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Source = require('./Source');

const Log = sequelize.define('Log', {
    logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Associations
User.hasMany(Log, { foreignKey: 'userId' });
Source.hasMany(Log, { foreignKey: 'sourceId' });

Log.belongsTo(User, { foreignKey: 'userId' });
Log.belongsTo(Source, { foreignKey: 'sourceId' });

module.exports = Log;