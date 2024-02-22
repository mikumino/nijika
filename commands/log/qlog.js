const { SlashCommandBuilder } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
const embedEntryLog = require('../../modules/embedEntryLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qlog')
        .setDescription('Quick log pre-existing source')
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source to log')
                .setAutocomplete(true)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Time to log (minutes)')
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const sources = await Source.findAll({ where: { userId: interaction.user.id, status: "In Progress", oneTime: false}});
        const choices = [];
        sources.forEach(source => {
            choices.push({ name: source.sourceName + ` (${source.sourceType})`, value: source.sourceId.toString() });
        })
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 25);
        await interaction.respond(filtered);
    },
    async execute(interaction) {
        const sourceId = interaction.options.getString('source');
        const duration = interaction.options.getInteger('duration');

        // Validate inputs
        // Checks that source exists and belongs to user
        const source = await Source.findOne({ where: { sourceId: sourceId, userId: interaction.user.id } });
        if (!source) {
            await interaction.reply({ content: 'Invalid source. Please try again.' });
            return;
        }
        if (duration < 1) {
            await interaction.reply({ content: 'Invalid duration. Please try again.' });
            return;
        }

        const log = await Log.createLog(sourceId, interaction.user.id, duration);
        const embed = await embedEntryLog.execute(log, source, interaction);

        await interaction.reply({ embeds: [embed] });
        
    },
};