const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomsource')
        .setDescription('Get a random source from your source list.')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('The type of source you want to get.')
                .setRequired(false)
                .addChoices(
                    { name: 'Book', value: 'Book' },
                    { name: 'Anime', value: 'Anime' },
                    { name: 'Manga', value: 'Manga' },
                    { name: 'Visual Novel', value: 'Visual Novel' },
                    { name: 'Video Game', value: 'Video Game' },
                    { name: 'Reading', value: 'Reading' },
                    { name: 'Listening', value: 'Listening' },
                    { name: 'Other', value: 'Other' },
                )
        ),
    async execute(interaction) {
        try {
            let sources;
            const sourceType = interaction.options.getString('type');
            if (!sourceType) {  // any source type
                sources = await Source.findAll({ where: { userId: interaction.user.id, status: "In Progress", oneTime: false } });
            } else {
                sources = await Source.findAll({ where: { userId: interaction.user.id, status: "In Progress", oneTime: false, sourceType: sourceType } });
            }
            if (sources.length === 0) {
                await interaction.reply({ content: 'You have no sources in progress of this type.' });
                return;
            }
            const randomSource = sources[Math.floor(Math.random() * sources.length)];

            const embed = new EmbedBuilder()
                .setTitle('Random Source')
                .setDescription(`Immerse with ${randomSource.sourceName}!`)
                .setColor('#ffe17e')
                .setThumbnail(interaction.user.avatarURL())
                .addFields({ name: 'Type', value: randomSource.sourceType, inline: true });

            await interaction.reply({ embeds: [embed] });

        } catch (e) {
            console.log(e);
            await interaction.reply({ content: 'Something went wrong. Please try again.' });
        }
    }
}