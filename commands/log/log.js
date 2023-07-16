const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const createSource = require('../../modules/createSource');
const oneTimeSource = require('../../modules/oneTimeSource');
const logExistingSource = require('../../modules/logExistingSource');

const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log info for immersion.'),
    async execute(interaction) {
        // Build embed for initial prompt
        const embed = new EmbedBuilder()
            .setTitle('Immersion Tracker')
            .setDescription('Select an existing source, or create a new/temporary one.')
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');

        // Get all sources from userId that are not completed nor one time
        const sources = await Source.findAll({ where: { userId: interaction.user.id, completed: false, oneTime: false } });
        // console.log(sources);

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('Title')
            .setPlaceholder('Make a selection!');
        // Add each source to the menu
        sources.forEach(source => {
            select_source.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(source.sourceName)
                    .setDescription(source.sourceType)
                    .setValue(source.sourceId.toString())
            );
        });

        // Add the rest of the options
        select_source.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Create new source')
                .setDescription('Creates a new source for future logs.')
                .setValue('createSource'),
            new StringSelectMenuOptionBuilder()
                .setLabel('One time source')
                .setDescription('Creates a one time source for a single log.')
                .setValue('oneTimeSource')
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
                logExistingSource.execute(confirmation, confirmation.values[0], collectorFilter);
            }
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Do you even really immerse??? :( I\'m impatient', embeds: [], components: [] });
        }


    }

}
