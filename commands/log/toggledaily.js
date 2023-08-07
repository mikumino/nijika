const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggledaily')
        .setDescription('Toggles daily leaderboard.'),
    async execute(interaction) {
        
    }
}