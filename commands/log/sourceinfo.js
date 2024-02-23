const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Source = require('../../models/Source');
const { toHoursMins } = require('../../modules/utils/datetimeUtils');
const { isAniListUrl, getMediaId, getCoverImage } = require('../../modules/utils/anilistUtils');
const { isVndbUrl, getVndbMediaId, getVndbCoverImage } = require('../../modules/utils/vndbUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sourceinfo')
        .setDescription('View details regarding a specific source')
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source to retrieve information from')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const sources = await Source.findAll({ where: {userId: interaction.user.id, oneTime: false}});
        const choices = [];
        sources.forEach(source => {
            choices.push({ name: source.sourceName, value: source.sourceId.toString() });
        })
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 25);
        await interaction.respond(filtered);
    },
    async execute(interaction) {
        const sourceId = interaction.options.getString('source');
        const source = await Source.findOne({ where: {sourceId: sourceId, userId: interaction.user.id} });
        let coverImage = null;
        if (!source) {
            await interaction.reply({ content: 'invalid source. Please try again.' });
            return;
        }
        // console.log(source);
        if (source.sourceDescription == "") {
            source.sourceDescription = "No description.";
        }
        if (isAniListUrl(source.sourceDescription)) {
            const mediaId = getMediaId(source.sourceDescription);
            coverImage = await getCoverImage(mediaId);
        }
        if (isVndbUrl(source.sourceDescription)) {
            const mediaId = getVndbMediaId(source.sourceDescription);
            coverImage = await getVndbCoverImage(mediaId);
            console.log(coverImage);
        }
        const durationHoursMins = toHoursMins(source.totalDuration);
        const embed = new EmbedBuilder()
            .setTitle(`${source.sourceName}`)
            .setDescription(`${source.sourceDescription}`)
            .setFields(
                { name: 'Type', value: `${source.sourceType}`, inline: true },
                { name: 'Total Time', value: `${durationHoursMins.hours}h ${durationHoursMins.mins}m`, inline: true },
                { name: 'Status', value: `${source.status}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');
        if (coverImage) {
            embed.setImage(coverImage);
        }
        await interaction.reply({ embeds: [embed] });
    },
}