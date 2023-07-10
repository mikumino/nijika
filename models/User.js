const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    XP: {
        type: DataTypes.DECIMAL(10, 1),
        defaultValue: 0.0,   
    },
});

module.exports = User;