const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
const User = require('../../models/User');
const { toHoursMins } = require('../../modules/utils/datetimeUtils');
const { isAniListUrl, getMediaId, getCoverImage } = require('../../modules/utils/anilistUtils');
const { isVndbUrl, getVndbMediaId, getVndbCoverImage } = require('../../modules/utils/vndbUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('undo')
        .setDescription('Undo last log entry'),
    async execute(interaction) {
        // get most recent log entry
        const logs = await Log.findAll({
            where: {
                userId: interaction.user.id,
            },
            order: [['createdAt', 'DESC']]
        });
        if (logs.length === 0) {
            return await interaction.reply({ content: 'You have no logs to undo.'});
        }
        // if we pass the condition then there is an existing log entry
        // get the necessary information from the log, logs is sorted in desc order by createdAt, so the first log is the most recent

        const log = logs[0];
        const createdAt = log.createdAt;
        const source = await Source.findOne({ where: { sourceId: log.sourceId } });
        const user = await User.findOne({ where: { userId: interaction.user.id } });

        // get anilist or vndb cover image if available
        let coverImage = null;
        if (isAniListUrl(source.sourceDescription)) {
            const mediaId = getMediaId(source.sourceDescription);
            coverImage = await getCoverImage(mediaId);
        }
        else if (isVndbUrl(source.sourceDescription)) {
            const mediaId = getVndbMediaId(source.sourceDescription);
            coverImage = await getVndbCoverImage(mediaId);
        }

        // Hours mins string
        const hoursMins = toHoursMins(log.duration);
        let hoursMinsString = "";
        if (hoursMins.hours == 0) {
            hoursMinsString = `${hoursMins.mins} minutes`;
        } else if (hoursMins.hours == 1) {
            hoursMinsString = `${hoursMins.hours} hour and ${hoursMins.mins} minutes`;
        } else {
            hoursMinsString = `${hoursMins.hours} hours and ${hoursMins.mins} minutes`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} undid ${hoursMinsString} of ${source.sourceName}... 💥`)
            .setDescription(`Log from ${createdAt.toLocaleString()} for ${source.sourceName} has been undone.`)
            .setFields(
                { name: 'Title', value: `${source.sourceName}`, inline: true },
                { name: 'Description', value: `${source.sourceDescription || 'No description.'}`, inline: true },
                { name: 'Type', value: `${source.sourceType}`, inline: false },
                { name: 'Experience Points', value: `${Log.calcXP(logs[0].duration)}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setImage(coverImage)
            .setColor('#ff7e7e');

        await log.destroy();
        user.XP -= log.duration * 1.2;
        user.XP = Math.round(user.XP * 10) / 10;
        await user.save();

        await interaction.reply({ embeds: [embed] });
        
    }
}