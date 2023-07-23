const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const Source = require('../models/Source');

module.exports = {
    async execute(confirmation, collectorFilter) {
        // Get all Paused sources
        const sources = await Source.findAll({ where: { status: 'Paused', userId: confirmation.user.id } });

        if (sources.length === 0 ) {
            confirmation.editReply({ content: 'You have no sources to resume.', components: [], embeds: [] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Resume Source')
            .setDescription('Select the source you would like to resume.')
            .setThumbnail(confirmation.user.avatarURL())
            .setColor('#ffe17e');

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('source_resume')
            .setPlaceholder('Make a selection!');
        
        sources.forEach(source => {
            select_source.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(source.sourceName)
                    .setDescription(source.sourceType)
                    .setValue(source.sourceId.toString())
            );
        });

        const row = new ActionRowBuilder().addComponents(select_source);
        await confirmation.update({ embeds: [embed], components: [row] });

        try {
            const sourceConfirmation = await confirmation.message.awaitMessageComponent({ filter: collectorFilter, time: 30000 });

            const source = await Source.findByPk(sourceConfirmation.values[0]);
            source.status = 'In Progress';
            await source.save();

            embed
                .setTitle('Source Resumed')
                .setDescription(`${source.sourceType} Source "${source.sourceName}" resumed.`)

            await sourceConfirmation.update({ embeds: [embed], components: [] });
        }   catch (e) {
            console.log(e);
            await confirmation.editReply({ content: 'Interaction expired. Please try again.', embeds: [], components: [] });
        }
    }
}