const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qonetime')
        .setDescription('Quick log one-time sources')
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source to log')
                .setAutocomplete(false)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sourcetype')
                .setDescription('Source type')
                .setRequired(true)
                .addChoices(
                    { name:'Book', value: 'Book' },
                    { name:'Anime', value: 'Anime' },
                    { name:'Manga', value: 'Manga' },
                    { name:'Visual Novel', value: 'Visual Novel' },
                    { name:'Video Game', value: 'Video Game' },
                    { name:'Reading', value: 'Reading' },
                    { name:'Listening', value: 'Listening' },
                    { name:'Other', value: 'Other' },
                ))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Time to log (minutes)')
                .setRequired(true))
        .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Description for source')
                        .setRequired(false)),
    async execute(interaction) {
        await interaction.reply({ content:
            `${interaction.options.getString('source')},${interaction.options.getString('sourcetype')}, ${interaction.options.getString('descriptiopn')}, ${interaction.options.getInteger('duration')}`
        });
    }
}