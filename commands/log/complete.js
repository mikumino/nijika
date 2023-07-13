const { StringSelectMenuOptionBuilder, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js')

const User = require('../../models/User');
const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('complete')
        .setDescription('Mark source as complete, removing it from source list.'),
    async execute(interaction) {
        // Check user exists and that they have sources to complete
        const [user, created] = await User.findOrCreate({ where: { userId: interaction.user.id } });
        const sources = await Source.findAll({ where: { userId: interaction.user.id, completed: false, oneTime: false } });

        if (sources.length === 0) {
            return await interaction.reply({ content: 'You have no sources to complete.' });   // make an embed later?
        }

        const embed = new EmbedBuilder()
            .setTitle('Source Completion')
            .setDescription('Select a source that you would like to mark as complete, removing it from the source list.')
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e')

        const select_source = new StringSelectMenuBuilder()
            .setCustomId('Title')
            .setPlaceholder('Make a selection!');
        sources.forEach(source => {
            select_source.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(source.sourceName)
                    .setValue(source.sourceId.toString())
            );
        });

        const row = new ActionRowBuilder()
            .addComponents(select_source);
        
        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 15000 });

            const completedSource = await Source.findByPk(confirmation.values[0]);
            completedSource.completed = true;
            await completedSource.save()

            const embed2 = new EmbedBuilder()
                .setTitle('Source Completed')
                .setDescription(`Source "${completedSource.sourceName}" marked as complete! Congrats!`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor('#ffe17e')

            confirmation.update({ embeds: [embed2], components: []});
            
        } catch (e) {
            console.log(e);
            await interaction.editReply({content: 'Do you even really immerse??? :( I\'m impatient', components: []});
        }

        

    }
}