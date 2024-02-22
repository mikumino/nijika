const { SlashCommandBuilder } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
const embedEntryLog = require('../../modules/embedEntryLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qonetime')
        .setDescription('Quick log one-time sources')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of source to log')
                .setAutocomplete(false)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
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
        const sourceName = interaction.options.getString('name');
        const sourceType = interaction.options.getString('type');
        const duration = interaction.options.getInteger('duration');
        let description = interaction.options.getString('description');

        // Validate inputs
        // Checks that source exists and belongs to user
        if (duration < 1) {
            await interaction.reply({ content: 'Invalid duration. Please try again.' });
            return;
        }

        if (!description) {
            description = '';
        }

        const source = await Source.create({ sourceName: sourceName, sourceDescription: description, sourceType: sourceType, userId: interaction.user.id, oneTime: true, totalDuration: duration, status: 'Completed' });

        const log = await Log.createLog(source.sourceId, interaction.user.id, duration);
        const embed = await embedEntryLog.execute(log, source, interaction);

        await interaction.reply({ embeds: [embed] });
    }
}