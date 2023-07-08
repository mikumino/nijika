const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Source = sequelize.define('Source', {
    sourceId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    sourceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sourceDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sourceType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Source;