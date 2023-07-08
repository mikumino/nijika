const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Log = sequelize.define('Log', {
    logId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sourceId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Log;