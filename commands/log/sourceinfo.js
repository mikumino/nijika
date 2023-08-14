const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sourceinfo')
        .setDescription('View details regarding a specific source')
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source to retrieve information from')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const sources = await Source.findAll({ where: {userId: interaction.user.id, oneTime: false}});
        const choices = [];
        sources.forEach(source => {
            choices.push({ name: source.sourceName, value: source.sourceId.toString() });
        })
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
        await interaction.respond(filtered);
    },
    async execute(interaction) {
        const sourceId = interaction.options.getString('source');
        const source = await Source.findOne({ where: {sourceId: sourceId, userId: interaction.user.id} });
        if (!source) {
            await interaction.reply({ content: 'invalid source. Please try again.' });
            return;
        }
        console.log(source);
        if (source.sourceDescription == "") {
            source.sourceDescription = "No description.";
        }
        const embed = new EmbedBuilder()
            .setTitle(`${source.sourceName}`)
            .setDescription(`${source.sourceDescription}`)
            .setFields(
                { name: 'Type', value: `${source.sourceType}`, inline: true },
                { name: 'Total Duration', value: `${source.totalDuration} minutes`, inline: true },
                { name: 'Status', value: `${source.status}`, inline: false },
                { name: 'One time', value: `${source.oneTime}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');
        await interaction.reply({ embeds: [embed] });
    },
}