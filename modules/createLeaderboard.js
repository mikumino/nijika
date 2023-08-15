const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const Log = require('../models/Log');
const { toHoursMins } = require('../modules/utils/datetimeUtils');

module.exports = {
    async create(interaction, startDate, endDate) {
        // Initialize embed
        const embed = new EmbedBuilder().setColor('#ffe17e');

        // Get logs within date range
        const logs = await Log.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });

        // Check if not empty
        if (logs.length === 0) {
            embed.setTitle('No logs found.')
            return embed;
        }

        // Create an array of users with their total XP
        const users = [];
        logs.forEach(log => {
            const user = users.find(user => user.userId === log.userId);
            const XP = Log.calcXP(log.duration);
            if (!user) {
                users.push({ userId: log.userId, XP: XP, totalDuration: log.duration });
            } else {
                user.XP += XP;
                user.XP = Math.round(user.XP * 10) / 10;
                user.totalDuration += log.duration;
            }
        });

        // Sort users by XP
        users.sort((a, b) => b.XP - a.XP);

        if (users.length > 10) {
            users.splice(10);
        }

        // Define emoji array
        const emojis = ['🥇', '🥈', '🥉'];

        // Add fields
        for (let i = 0; i < users.length; i++) {
            const user = await interaction.client.users.fetch(users[i].userId);
            const hoursMins = toHoursMins(users[i].totalDuration);
            let placeString;
            if (i+1 <= 3) {
                placeString = emojis[i];
            }
            else {
                placeString = `${i+1}. `;
            }
            embed.addFields(
                { name:`${placeString}${user.username}`, value:`${users[i].XP} points (${hoursMins.hours}h ${hoursMins.mins}m)`, inline: false },
                );
        }

        embed.setImage('https://media.discordapp.net/attachments/1080024801424441445/1129705898927984752/jCVsxrW.png?width=960&height=541');

        return embed;
    }
}