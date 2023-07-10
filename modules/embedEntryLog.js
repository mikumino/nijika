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
                { name: 'Experience Points', value: `${log.duration*1.2}`, inline: false },
            )
            .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0')
            .setColor('#ffe17e');
    }
}