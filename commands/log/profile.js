const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const datetimeUtils = require('../../modules/utils/datetimeUtils');

const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your profile.'),
    async execute(interaction) {
        // Get User object from database
        const [user, created] = await User.findOrCreate({ where: {userId: interaction.user.id} });

        // Convert XP to HHhMMm format
        const XP = Math.round((user.XP / 1.2) * 10) / 10;
        const XPString = datetimeUtils.toHoursMinsShortString(XP);

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}`)
            .setFields(
                { name: 'XP', value: `${user.XP}`, inline: false },
                { name: 'Total Time', value: `${XPString}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');

        // Send it lol
        await interaction.reply({ embeds: [embed] });
    }
}