const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, createMessageComponentCollector, Events, ModalBuilder, TextInputBuilder } = require('discord.js');

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
        
        console.log('action row built');
        const response = await interaction.reply({
            content: 'Select a previous immersion source, or create a new / temporary one.',
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            console.log('DEBUG');
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 150000 });
            if (confirmation.values[0] === 'createSource') {
                console.log("createSource");
                // Edit select menu to let user select a content type
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

                const row2 = new ActionRowBuilder()
                    .addComponents(select_content_type);
                console.log("fuck");
                await interaction.editReply({
                    content: 'Select the type of content you are logging.',
                    components: [row2],
                });
                console.log(confirmation);

                const typeConfirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 900000 });

                if (typeConfirmation.values[0] === 'book') {
                    // temp, edit message for confirmation
                    await typeConfirmation.update({ content: 'Book selected', components: [] });
                }
            }
            else if (confirmation.customId === 'oneTimeSource') {
                const one_time_menu = new ModalBuilder()
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

                
            }
        } catch (e) {
            await interaction.editReply({ content: 'Do you even really immerse??? :( I\'m impatient', components: [] });
        }


    }
    
}
