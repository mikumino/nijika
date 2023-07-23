const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const updateInfo = require('../../modules/updateSource');
const pauseSource = require('../../modules/pauseSource');
const resumeSource = require('../../modules/resumeSource');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edit a source\'s info, pause, or resume it.'),
    async execute(interaction) {
        // Build embed for initial prompt
        const embed = new EmbedBuilder()
            .setTitle('Edit a source')
            .setDescription('Select how you want to edit a source.')
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e')
        
        // Build select menu
        const select_pause = new StringSelectMenuBuilder()
            .setCustomId('edit_menu')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Update Info')
                    .setDescription('Update an in progresss source\'s info (title/description).')
                    .setValue('update'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Pause')
                    .setDescription('Pause a source.')
                    .setValue('pause'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Resume')
                    .setDescription('Resume a source.')
                    .setValue('resume')
            );

        // Build action row
        const row = new ActionRowBuilder().addComponents(select_pause);

        // Send initial prompt
        const response = await interaction.reply({ embeds: [embed], components: [row] });

        // Filter for collector
        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            // Wait for user to select an option
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 15000 });

            // If user selects update info, update info
            if (confirmation.values[0] === 'update') {
                updateInfo.execute(confirmation, collectorFilter);
            }

            // If user selects pause, pause a source
            if (confirmation.values[0] === 'pause') {
                pauseSource.execute(confirmation, collectorFilter);
            }

            // User chooses to resume a source
            else if (confirmation.values[0] === 'resume') {
                resumeSource.execute(confirmation, collectorFilter);
            }
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Interaction expired. Please try again.', embeds: [], components: [] });
        }
    }
}