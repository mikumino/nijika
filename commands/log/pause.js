const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume a Source'),
    async execute(interaction) {
        // Build embed for initial prompt
        const embed = new EmbedBuilder()
            .setTitle('Pause or resume a Source')
            .setDescription('Select whether you would like to pause or resume a source.')
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e')
        
        // Build select menu
        const select_pause = new StringSelectMenuBuilder()
            .setCustomId('pause_menu')
            .setPlaceholder('Make a selection!')
            .addOptions(
                { label: 'Pause', description: 'Pause a source', value: 'pause' },
                { label: 'Resume', description: 'Resume a source', value: 'resume' }
            );

        // Build action row
        const row = new ActionRowBuilder().addComponents(select_pause);

        // Send initial prompt
        const response = await interaction.reply({ embeds: [embed], components: [row] });
    }
}