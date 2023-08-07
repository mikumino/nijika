const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = path.join(__dirname, '../../config.json');

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Sets current channel as channel for logging.'),
    async execute(interaction) {
        try {
            // Check if user has "Manage Server" permissions
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.' });
            }

            const configData = JSON.parse(fs.readFileSync(config));

            // Set channel
            configData.logChannelId = interaction.channelId;
            fs.writeFileSync(config, JSON.stringify(configData, null, 4));
            await interaction.reply({ content: `Log channel set to ${interaction.channel}.` });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'Something went wrong. Please try again.' });
        }
    }
}