const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const promptContentType = require('./promptContentType');

const User = require('../models/User');
const Source = require('../models/Source');

module.exports = {
    async execute(confirmation, collectorFilter) {
        try {
            // Build menu for selecting content type
            typeConfirmation = await promptContentType.execute(confirmation, collectorFilter);

            const contentType = typeConfirmation.values[0];

            // Build modal for user to input title and description
            const sourceMenu = new ModalBuilder()
                .setCustomId('sourceModal')
                .setTitle('New Source');
            const sourceTitle = new TextInputBuilder()
                .setCustomId('sourceTitle')
                .setLabel('Title')
                .setStyle(TextInputStyle.Short);
            const sourceDescription = new TextInputBuilder()
                .setCustomId('sourceDescription')
                .setLabel('Description')
                .setStyle(TextInputStyle.Paragraph);


            const firstAction = new ActionRowBuilder().addComponents(sourceTitle);
            const secondAction = new ActionRowBuilder().addComponents(sourceDescription);

            sourceMenu.addComponents(firstAction, secondAction);

            // Prompt user with modal
            await typeConfirmation.showModal(sourceMenu);

            // Wait for modal submission and assign values to variables
            const sourceConfirmation = await typeConfirmation.awaitModalSubmit({ filter: collectorFilter, time: 30000 });

            if (sourceConfirmation) {
                // Extract fields from modal submission and assign to variables
                const title = sourceConfirmation.fields.getTextInputValue('sourceTitle');
                const description = sourceConfirmation.fields.getTextInputValue('sourceDescription');

                // Get or create user
                const [user, created] = await User.findOrCreate({ where: { userId: typeConfirmation.user.id } });

                // Check that user hasn't already created a source of the same type with the same title
                const existingSource = await Source.findOne({ where: { sourceName: title, sourceType: contentType, userId: user.userId, oneTime: false }, });

                const embed = new EmbedBuilder()

                if (existingSource) {
                    embed
                        .setTitle('Source Already Exists')
                        .setDescription(`You already have a source of type "${contentType}" with the title "${title}"!`)
                        .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0');
                    sourceConfirmation.update({ embed: [existsEmbed], components: [] });
                    return;
                }

                // Create source
                await Source.create({ sourceName: title, sourceDescription: description, sourceType: contentType, userId: user.userId });

                embed
                    .setTitle('Source Created')
                    .setDescription(`Source "${title}" successfully created!`)
                    .setFields(
                        { name: 'Title', value: title, inline: true },
                        { name: 'Description', value: description, inline: true },
                        { name: 'Type', value: contentType, inline: true },
                    )
                    .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0');

                sourceConfirmation.update({ embeds: [embed], components: [] });
            }
        } catch (error) {
            console.log(error);
            confirmation.editReply({ content: 'No response given in the timeframe, canceling interaction', embeds: [], components: [] });
        }
    }
}