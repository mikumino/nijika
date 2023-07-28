const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
const User = require('../../models/User');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Summary of last 20 hours of logs'),
    async execute(interaction) {
        // Check user exists and that they set a timezone
        const [user, created] = await User.findOrCreate({ where: { userId: interaction.user.id } });
        if (user.timezone === '') {
            return await interaction.reply('You must set a timezone before using this command. Use /timezone to set your timezone.');
        }

        // function to convert duration (mins) to hours and mins
        const toHoursMins = (duration) => {
            let hours = Math.floor(duration / 60);
            let mins = duration % 60;
            return `${hours}h ${mins}m`;
        }

        // Get last 20 hours of logs from user id, ascending order
        const logs = await Log.findAll({
            where: {
                userId: interaction.user.id,
                createdAt: { [Op.gte]: new Date(Date.now() - 20 * 60 * 60 * 1000) }
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
            const source = await Source.findByPk(epicLogs[i].sourceId);
            embed.addFields({ name: `${source.sourceName} - ${source.sourceType}`, value: `${toHoursMins(epicLogs[i].duration)} → ${Log.calcXP(epicLogs[i].duration)} points`, inline: false });
        }

        // total field
        embed.addFields({ name: `-- Total Time --`, value: `${toHoursMins(total) } → ${Log.calcXP(total)} points`, inline: false });

        await interaction.reply({ embeds: [embed] });   // WAHOO

    }
}