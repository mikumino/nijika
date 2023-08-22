const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const xml2js = require('xml2js');
const fs = require('fs');
const Source = require('../../models/Source');
const Log = require('../../models/Log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Export your data to an XML file.'),
    async execute(interaction) {
        const sources = await Source.findAll({ where: { userId: interaction.user.id }, raw: true });
        const logs = await Log.findAll({ where: { userId: interaction.user.id }, raw: true });

        const builder = new xml2js.Builder();
        const xml = builder.buildObject({ sources, logs });

        fs.writeFile(__dirname + `${interaction.user.id}.xml`, xml, (err) => {
            if (err) throw err;
        });

        const xmlFile = new AttachmentBuilder(__dirname + `${interaction.user.id}.xml`);

        await interaction.reply({ files: [xmlFile] });

        fs.unlinkSync(__dirname + `${interaction.user.id}.xml`);
        
    }
}