const { SlashCommandBuilder } = require('discord.js');
const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qlog')
        .setDescription('Quick log pre-existing source')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Phrase to search for')
                .setAutoComplete(true)),
}