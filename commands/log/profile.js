const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your profile.'),
    async execute(interaction) {
        // Get User object from database
        const [user, created] = await User.findOrCreate({ where: {userId: interaction.user.id} });

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}`)
            .setFields(
                { name: 'XP', value: `${user.XP}`, inline: true },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');

        // Send it lol
        await interaction.reply({ embeds: [embed] });
    }
}