const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    async execute(confirmation, collectorFilter) {
        const select_content_type = new StringSelectMenuBuilder()
            .setCustomId('contentType')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Book')
                    .setValue('BOOK'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Anime')
                    .setValue('ANIME'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Manga')
                    .setValue('MANGA'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Visual Novel')
                    .setValue('VN'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Video Game')
                    .setValue('GAME'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Reading')
                    .setValue('READING'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Listening')
                    .setValue('LISTENING'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Other')
                    .setValue('OTHER')
            )
        // Build action row for menu
        const row2 = new ActionRowBuilder()
            .addComponents(select_content_type);
        // Update message to prompt user to select content type
        await confirmation.update({
            content: 'Select the type of content you are logging.',
            components: [row2],
        });

        const typeConfirmation = await confirmation.message.awaitMessageComponent({ filter: collectorFilter, time: 30000 });

        return typeConfirmation;
    }
}