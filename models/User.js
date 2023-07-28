const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    XP: {
        type: DataTypes.DECIMAL(10, 1),
        defaultValue: 0.0,   
    },
    timezone: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
});

module.exports = User;