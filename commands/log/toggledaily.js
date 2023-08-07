const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggledaily')
        .setDescription('Toggles daily leaderboard.'),
    async execute(interaction) {
        try {
            // Check perms
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.' });
            }

            const configData = JSON.parse(fs.readFileSync(config));

            // Toggle daily
            configData.dailyLeaderboard = !configData.dailyLeaderboard;
            fs.writeFileSync(config, JSON.stringify(configData, null, 4));
            await interaction.reply({ content: `Daily leaderboard toggled ${configData.dailyLeaderboard ? 'on' : 'off'}.` });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'Something went wrong. Please try again.' });
        }
    }
}