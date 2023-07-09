const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Source = sequelize.define('Source', {
    sourceId : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    oneTime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// Associations
User.hasMany(Source, { foreignKey: 'userId' });

Source.belongsTo(User, { foreignKey: 'userId' });

module.exports = Source;