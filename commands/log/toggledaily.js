const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = path.join(__dirname, '../../config.json');
const dailyLeaderboard = require('../../modules/dailyLeaderboard');

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

            // get channel
            const channel = await interaction.client.channels.fetch(configData.logChannelId);

            // If daily is enabled, start cron job
            if (configData.dailyLeaderboard) {
                dailyLeaderboard.start(channel);
            }
            else {
                dailyLeaderboard.stop();
            }
            await interaction.reply({ content: `Daily leaderboard toggled ${configData.dailyLeaderboard ? 'on' : 'off'}.` });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'Something went wrong. Please try again.' });
        }
    }
}