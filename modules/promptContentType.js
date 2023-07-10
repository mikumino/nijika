const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    async execute(confirmation, collectorFilter) {
        // Embed for content type prompt
        const contentTypeEmbed = new EmbedBuilder()
            .setTitle('Immersion Tracker')
            .setDescription('Select the type of content you are logging.')
            .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0')
            .setColor('#ffe17e');

        const select_content_type = new StringSelectMenuBuilder()
            .setCustomId('contentType')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Book')
                    .setValue('Book'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Anime')
                    .setValue('Anime'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Manga')
                    .setValue('Manga'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Visual Novel')
                    .setValue('Visual Novel'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Video Game')
                    .setValue('Video Game'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Reading')
                    .setValue('Reading'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Listening')
                    .setValue('Listening'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Other')
                    .setValue('Other')
            )
        // Build action row for menu
        const row2 = new ActionRowBuilder()
            .addComponents(select_content_type);
        // Update message to prompt user to select content type
        await confirmation.update({
            embeds: [contentTypeEmbed],
            components: [row2],
        });

        const typeConfirmation = await confirmation.message.awaitMessageComponent({ filter: collectorFilter, time: 30000 });

        return typeConfirmation;
    }
}