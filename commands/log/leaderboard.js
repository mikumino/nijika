const { SlashCommandBuilder } = require('discord.js');
const createLeaderboard = require('../../modules/createLeaderboard');

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

        // init embed with monthly leaderboard
        const embed = await createLeaderboard.create(interaction, startDate, endDate);

        await interaction.reply({ embeds: [embed] });
    }
}