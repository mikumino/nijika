const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const Source = require('../models/Source');

module.exports = {
    async execute(confirmation, collectorFilter) {
        const sources = await Source.findAll({ where: { status: 'In Progress', userId: confirmation.user.id } });

        if (sources.length === 0) {
            confirmation.update({ content: 'You have no sources to edit.', components: [], embeds: [] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Update Source')
            .setDescription('Select the source you would like to update.')
            .setThumbnail(confirmation.user.avatarURL())
            .setColor('#ffe17e');

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('source_update')
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

            const updateModal = new ModalBuilder()
                .setCustomId('updateModal')
                .setTitle('Update Source');
            const sourceTitle = new TextInputBuilder()
                .setCustomId('sourceTitle')
                .setLabel('Title (Leave blank to keep current)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            const sourceDescription = new TextInputBuilder()
                .setCustomId('sourceDescription')
                .setLabel('Description (Leave blank to keep current)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)

            const row1 = new ActionRowBuilder().addComponents(sourceTitle);
            const row2 = new ActionRowBuilder().addComponents(sourceDescription);

            updateModal.addComponents(row1, row2);

            await sourceConfirmation.showModal(updateModal);

            const updateConfirmation = await sourceConfirmation.awaitModalSubmit({ filter: collectorFilter, time: 30000 });

            if (updateConfirmation.message.id !== confirmation.message.id) {
                throw new Error('Wrong message ID');
            }

            if (updateConfirmation) {
                const title = updateConfirmation.fields.getTextInputValue('sourceTitle');
                const description = updateConfirmation.fields.getTextInputValue('sourceDescription');

                // Check exists
                const existingSource = await Source.findOne({ where: { sourceName: title, userId: confirmation.user.id } });
                if (existingSource) {
                    embed
                        .setTitle('Source Already Exists')
                        .setDescription(`You already have a source named "${title}". Please try again.`);
                    updateConfirmation.update({ embeds: [embed], components: [] });
                    return;
                }

                if (title !== '') {
                    source.sourceName = title;
                }
                if (description !== '') {
                    source.sourceDescription = description;
                }

                await source.save();

                let sourceEmbedDesc = source.sourceDescription;
                if (sourceEmbedDesc === '') {
                    sourceEmbedDesc = 'No description.';
                }

                embed
                    .setTitle('Source Updated')
                    .setDescription(`${source.sourceType} Source "${source.sourceName}" updated.`)
                    .setFields(
                        { name: 'Title', value: source.sourceName, inline: true },
                        { name: 'Description', value: sourceEmbedDesc, inline: true }
                    )
                
                await updateConfirmation.update({ embeds: [embed], components: [] });
            }
            
        } catch (e) {
            console.log(e);
            await confirmation.editReply({ content: 'Interaction expired. Please try again.', embeds: [], components: [] });
        }
    }
}