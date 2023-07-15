const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard with various date range options.'),
    async execute(interaction) {
        
    }
}