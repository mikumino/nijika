const { ActionRowBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    async execute(confirmation, collectorFilter) {
        console.log("createSource");
        // Build menu for selecting content type
        const select_content_type = new StringSelectMenuBuilder()
            .setCustomId('contentType')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Book')
                    .setValue('book'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Anime')
                    .setValue('anime'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Manga')
                    .setValue('manga'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Visual Novel')
                    .setValue('vn'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Video Game')
                    .setValue('game'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Reading')
                    .setValue('reading'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Listening')
                    .setValue('listening'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Other')
                    .setValue('other')
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

        // Assign content type to variable
        const contentType = typeConfirmation.values[0];
        console.log(contentType);

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
            sourceConfirmation.update({ content: `Source "${title}" successfully created!`, components: [] });
            // TODO: Add source to database (content type, title, description)
        }
    }
}