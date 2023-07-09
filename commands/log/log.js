const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const createSource = require('../../modules/createSource');
const oneTimeSource = require('../../modules/oneTimeSource');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log info for immersion.'),
    async execute(interaction) {
        // Build embed for initial prompt
        const embed = new EmbedBuilder()
            .setTitle('Immersion Tracker')
            .setDescription('Select an existing source, or create a new/temporary one.')
            .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0'); // lol hardcoded

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
            embeds: [embed],
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            // Wait for user to select an option
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 15000 });

            // If user selects createSource, create a new source
            if (confirmation.values[0] === 'createSource') {    // values[0] because only one option can be selected
                createSource.execute(confirmation, collectorFilter);
            }

            // User chooses to create a one time source
            else if (confirmation.values[0] === 'oneTimeSource') {
                oneTimeSource.execute(confirmation, collectorFilter);
            }

            else {
                await interaction.update({ content: 'dont click this one yet', components: [] });
            }
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Do you even really immerse??? :( I\'m impatient', components: [] });
        }


    }

}
