const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
const { Op } = require('sequelize');
const { toHoursMins } = require('../../modules/utils/datetimeUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Summary of last day of logs'),
    async execute(interaction) {
        const startTime = new Date();
        startTime.setHours(0, 0, 0, 0);
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 999);

        // Get last 20 hours of logs from user id, ascending order
        const logs = await Log.findAll({
            where: {
                userId: interaction.user.id,
                createdAt: { [Op.between]: [startTime, endTime] }
            },
            order: [['createdAt', 'ASC']]
        });

        if (logs.length === 0) {
            return await interaction.reply('No logs found. Go immerse!');
        }

        // Logs with associated log id and total duration
        const epicLogs = [];
        logs.forEach(log => {
            const epicLog = epicLogs.find(epicLog => epicLog.sourceId === log.sourceId);
            if (!epicLog) {
                epicLogs.push({ sourceId: log.sourceId, duration: log.duration });
            } else {
                epicLog.duration += log.duration;
            }
        });

        // Calculate total time
        let total = 0;
        epicLogs.forEach(epicLog => {
            total += epicLog.duration;
        });

        // Embed time lets GOOOOOO
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Daily Summary 🕙`)
            .setColor('#ffe17e')
            .setThumbnail(interaction.user.avatarURL())

        // fields             :) inm so tired
        for (let i = 0; i < epicLogs.length; i++) {
            const hoursMins = toHoursMins(epicLogs[i].duration);
            const source = await Source.findByPk(epicLogs[i].sourceId);
            embed.addFields({ name: `${source.sourceName} - ${source.sourceType}`, value: `${hoursMins.hours}h ${hoursMins.mins}m → ${Log.calcXP(epicLogs[i].duration)} points`, inline: false });
        }

        // total field
        const hoursMins = toHoursMins(total);
        embed.addFields({ name: `-- Total Time --`, value: `${hoursMins.hours}h ${hoursMins.mins}m → ${Log.calcXP(total)} points`, inline: false });

        await interaction.reply({ embeds: [embed] });   // WAHOO

    }
}