const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = path.join(__dirname, '../../config.json');
const autoLeaderboard = require('../../modules/autoLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleautoleaderboard')
        .setDescription('Toggles auto leaderboard. Runs every day and month.'),
    async execute(interaction) {
        try {
            // Check perms
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.' });
            }

            const configData = JSON.parse(fs.readFileSync(config));

            // Toggle auto
            configData.autoLeaderboard = !configData.autoLeaderboard;
            fs.writeFileSync(config, JSON.stringify(configData, null, 4));

            // get channel
            const channel = await interaction.client.channels.fetch(configData.logChannelId);

            // If auto is enabled, start cron job
            if (configData.autoLeaderboard) {
                autoLeaderboard.start(channel);
            }
            else {
                autoLeaderboard.stop();
            }
            await interaction.reply({ content: `Auto leaderboard toggled ${configData.autoLeaderboard ? 'on' : 'off'}.` });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'Something went wrong. Please try again.' });
        }
    }
}