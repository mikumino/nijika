const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const createLeaderboard = require('../../modules/createLeaderboard');
const datetimeUtils = require('../../modules/utils/datetimeUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard.')
        .addStringOption(option => option
            .setName('range')
            .setDescription('The date range to display the leaderboard for (default: monthly)')
            .setRequired(false)
            .addChoices(
                { name: 'Daily', value: 'daily' },
                { name: 'Weekly', value: 'weekly' },
                { name: 'Monthly', value: 'monthly' },
            )),
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

        const range = interaction.options.getString('range') || 'monthly';
        let { startDate, endDate } = datetimeUtils.dateRanges[range]();
        let embed = await createLeaderboard.create(interaction, startDate, endDate);

        // set title
        embed.setTitle(`${range.charAt(0).toUpperCase() + range.slice(1)} Leaderboard 🏆`);

        const response = await interaction.reply({ embeds: [embed], components: [selectRow] });

        // Select menu listener
        const filter = i => i.customId === 'leaderboard' && i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            // yoink dates
            let { startDate, endDate } = datetimeUtils.dateRanges[i.values[0]]();
            embed = await createLeaderboard.create(i, startDate, endDate);
            embed.setTitle(`${i.values[0].charAt(0).toUpperCase() + i.values[0].slice(1)} Leaderboard 🏆`);
            await i.update({ embeds: [embed] });
        });
    }
}