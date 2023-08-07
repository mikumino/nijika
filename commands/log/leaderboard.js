const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const createLeaderboard = require('../../modules/createLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard.'),
    async execute(interaction) {
        // Create select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('leaderboard')
            .setPlaceholder('Select a date range')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Daily')
                    .setValue('daily'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Weekly')
                    .setValue('weekly'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Monthly')
                    .setValue('monthly'),
            );
        
        const selectRow = new ActionRowBuilder().addComponents(selectMenu);

        // Default to monthly (start of current month to end of current month)
        let startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);

        // init embed with monthly leaderboard
        let embed = await createLeaderboard.create(interaction, startDate, endDate);

        // set title
        embed.setTitle('Monthly Leaderboard 🏆');

        const response = await interaction.reply({ embeds: [embed], components: [selectRow] });

        // Select menu listener
        const filter = i => i.customId === 'leaderboard' && i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.values[0] === 'daily') {

                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                embed = await createLeaderboard.create(i, startDate, endDate);
                embed.setTitle('Daily Leaderboard 🏆');
            }
            else if (i.values[0] === 'weekly') {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - startDate.getDay());
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
                endDate.setHours(23, 59, 59, 999);
                embed = await createLeaderboard.create(i, startDate, endDate);
                embed.setTitle('Weekly Leaderboard 🏆');
            }
            else if (i.values[0] === 'monthly') {
                startDate = new Date();
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                endDate.setDate(0);
                endDate.setHours(23, 59, 59, 999);
                embed = await createLeaderboard.create(i, startDate, endDate);
                embed.setTitle('Monthly Leaderboard 🏆');
            }
            await i.update({ embeds: [embed] });
        });
    }
}