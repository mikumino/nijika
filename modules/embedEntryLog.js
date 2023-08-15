const { EmbedBuilder } = require('discord.js');
const Log = require('../models/Log');
const { toHoursMins } = require('../modules/utils/datetimeUtils');

module.exports = {
    execute(log, source, interaction) {
        if (source.sourceDescription == "") {
            source.sourceDescription = "No description.";
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
        }   // im sure theres a better way, but this works for now
        return new EmbedBuilder() 
            .setTitle(`${interaction.user.username} logged ${hoursMinsString}! 🎉`)
            .setDescription(`Source "${source.sourceName}" has been logged ${hoursMinsString}!`)
            .setFields(
                { name: 'Title', value: `${source.sourceName}`, inline: true },
                { name: 'Description', value: `${source.sourceDescription}`, inline: true },
                { name: 'Type', value: `${source.sourceType}`, inline: false },
                { name: 'Experience Points', value: `${Log.calcXP(log.duration)}`, inline: false },
            )
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');
    }
}