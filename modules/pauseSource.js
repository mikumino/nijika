const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const Source = require('../models/Source');

module.exports = {
    async execute(confirmation, collectorFilter) {
        // Get all In Progress sources
        const sources = await Source.findAll({ where: { status: 'In Progress', userId: confirmation.user.id } });

        // If user has no In Progress sources, send message and return
        if (sources.length === 0) {
            confirmation.update({ content: 'You have no sources to pause.', components: [], embeds: [] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Pause Source')
            .setDescription('Select the source you would like to pause.')
            .setThumbnail(confirmation.user.avatarURL())
            .setColor('#ffe17e');

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('source_pause')
            .setPlaceholder('Make a selection!');
        
        // TODO: check log.js for more info
        sources.sort((a, b) => b.createdAt - a.createdAt);
        if (sources.length > 22) {
            sources.splice(22);
        }


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
            source.status = 'Paused';
            await source.save();

            embed
                .setTitle('Source Paused')
                .setDescription(`${source.sourceType} Source "${source.sourceName}" paused.`)

            await sourceConfirmation.update({ embeds: [embed], components: [] });

        } catch (e) {
            console.log(e);
            await confirmation.editReply({ content: 'Interaction expired. Please try again.', embeds: [], components: [] });
        }
    }
}