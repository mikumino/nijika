const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../models/Log');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard.'),
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

        // Check if there are any logs
        if (logs.length === 0) {
            await interaction.reply({ content: 'No logs found for this date range. Go immerse!' });
            return; // bad practice?
        }

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

        if (users.length > 10) {
            users.splice(10);
        }

        // // test to see if first user is correct
        // const firstUser = (await interaction.client.users.fetch(users[1].userId)).username;
        // await interaction.reply({ content: firstUser });

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle(`Monthly Leaderboard 🏆`)
            .setImage('https://media.discordapp.net/attachments/1080024801424441445/1129705898927984752/jCVsxrW.png?width=960&height=541')
            .setColor('#ffe17e');

        // Define emoji array
        const emojis = ['🥇', '🥈', '🥉'];

        // Add fields
        for (let i = 0; i < users.length; i++) {
            const user = await interaction.client.users.fetch(users[i].userId);
            let placeString;
            if (i+1 <= 3) {
                placeString = emojis[i];
            }
            else {
                placeString = `${i+1}. `;
            }
            embed.addFields(
                { name:`${placeString}${user.username}`, value:`${users[i].XP} points`, inline: false },
                );
        }

        await interaction.reply({ embeds: [embed] });
    }
}