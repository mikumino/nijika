const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, TextInputStyle, Events, ModalBuilder, TextInputBuilder, ModalSubmitFields } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log info for immersion.'),
    async execute(interaction) {
        // TODO: Get user id and pull titles for first menu
        const select_source = new StringSelectMenuBuilder()
            .setCustomId('Title')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Create new source')
                    .setDescription('Creates a new source for future logs.')
                    .setValue('createSource'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('One time source')
                    .setDescription('Creates a one time source for a single log.')
                    .setValue('oneTimeSource'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Title')
                    .setDescription('Written Description')
                    .setValue('titleKey')
            )

        const row = new ActionRowBuilder()
            .addComponents(select_source);
        
        const response = await interaction.reply({
            content: 'Select a previous immersion source, or create a new / temporary one.',
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            // Wait for user to select an option
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 150000 });

            // If user selects createSource, create a new source
            if (confirmation.values[0] === 'createSource') {    // values[0] because only one option can be selected
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

                const typeConfirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 900000 });

                // Assign content type to variable
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
                const sourceConfirmation = await typeConfirmation.awaitModalSubmit({ filter: collectorFilter, time: 900000 });
                
                if (sourceConfirmation) {
                    // Extract fields from modal submission and assign to variables
                    const title = sourceConfirmation.fields.getTextInputValue('sourceTitle');
                    const description = sourceConfirmation.fields.getTextInputValue('sourceDescription');
                    sourceConfirmation.update({ content: `Source "${title}" successfully created!`, components: [] });
                    // TODO: Add source to database (content type, title, description)
                }
            }

            else if (confirmation.values[0] === 'oneTimeSource') {
                console.log("enter else if.")
                const oneTimeMenu = new ModalBuilder()
                    .setCustomId('oneTimeModal')
                    .setTitle('One Time Source');
                const oneTimeTitle = new TextInputBuilder()
                    .setCustomId('oneTimeTitle')
                    .setLabel('Title')
                    .setStyle(TextInputStyle.Short);
                const oneTimeDescription = new TextInputBuilder()
                    .setCustomId('oneTimeDescription')
                    .setLabel('Description')
                    .setStyle(TextInputStyle.Paragraph);

                const firstActionOneTime = new ActionRowBuilder().addComponents(oneTimeTitle);
                const secondActionOneTime = new ActionRowBuilder().addComponents(oneTimeDescription);

                oneTimeMenu.addComponents(firstActionOneTime, secondActionOneTime);

                await confirmation.showModal(oneTimeMenu);
                
            }
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Do you even really immerse??? :( I\'m impatient', components: [] });
        }


    }
    
}
