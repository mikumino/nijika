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

// createLog - creates a log entry and awards XP to the user
Log.createLog = async function (sourceId, userId, duration) {
    const log = await Log.create({ duration: duration, sourceId: sourceId, userId: userId });

    // Give user XP
    const user = await User.findOne({ where: { userId: userId } });
    user.XP += duration*1.2;
    // Round to one decimal place
    user.XP = Math.round(user.XP * 10) / 10;

    await user.save();

    // Update source total duration if not one time
    const source = await Source.findOne({ where: { sourceId: sourceId } });
    if (!source.oneTime) {
        source.totalDuration += duration;
        await source.save();
    }

    return log;
}

module.exports = Log;