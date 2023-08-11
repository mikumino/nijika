const { SlashCommandBuilder } = require('discord.js');
const Source = require('../../models/Source');

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
            choices.push({ name: source.sourceName, value: source.sourceId.toString() });
        })
        const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
        await interaction.respond(filtered);
    },
    async execute(interaction) {
        const sourceId = interaction.options.getString('source');
        const duration = interaction.options.getInteger('duration');

        await interaction.reply( { content: `Source id chosen: ${sourceId}, duration: ${duration}` });
    },
};