const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js')

const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('complete')
        .setDescription('Mark source as complete, removing it from source list.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Source Completion')
            .setDescription('Select a source that you would like to mark as complete, removing it from the source list.')
            .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0')
            .setColor('#ffe17e')
        
        const sources = await Source.findAll({ where: { userId: interaction.userId, completed: false, oneTime: false}});

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('Title')
            .setPlaceholder('Make a selection!');
        sources.forEach(source => {
            select_source.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(source.sourceName)
                    .setDescription(source.sourceType)
                    .setValue(source.sourceName)
            );
        });

        const row = new ActionRowBuilder()
            .addComponents(select_source);
        
        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

    

    }
}