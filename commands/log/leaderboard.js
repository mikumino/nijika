const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../models/Log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard with various date range options.'),
    async execute(interaction) {
        // Default to monthly (start of current month to end of current month)
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);

        // Query database for all logs within the date range
        const logs = await Log.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });

        // Create an array of users with their total XP
        const users = [];
        logs.forEach(log => {
            const user = users.find(user => user.userId === log.userId);
            const XP = Log.calcXP(log.duration);
            if (!user) {
                users.push({ userId: log.userId, XP: XP });
            } else {
                user.XP += XP;
            }
        });

        // Sort users by XP
        users.sort((a, b) => b.XP - a.XP);

        // Create embed
    }
}