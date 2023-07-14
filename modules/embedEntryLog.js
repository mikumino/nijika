const { EmbedBuilder } = require('discord.js');

module.exports = {
    execute(log, source, interaction) {
        return new EmbedBuilder()
            .setTitle(`${interaction.user.username} logged ${log.duration} minutes! 🎉`)
            .setDescription(`Source "${source.sourceName}" has been logged ${log.duration} minutes!`)
            .setFields(
                { name: 'Title', value: `${source.sourceName}`, inline: true },
                { name: 'Description', value: `${source.sourceDescription}`, inline: true },
                { name: 'Type', value: `${source.sourceType}`, inline: false },
                { name: 'Experience Points', value: `${Math.round((log.duration*1.2)*10)/10}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');
    }
}