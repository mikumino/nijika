const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');
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
            option.setName('time')
                .setDescription('Time to log')
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const sources = await Source.findAll({ where: { userId: interaction.user.id, status: "In Progress", oneTime: false}});
        const choices = [];
        sources.forEach(source => {
            console.log(source.sourceName);
            choices.push(source.sourceName);
        })
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice}))
        );
    },
    async execute(interaction) {
        
    },
};