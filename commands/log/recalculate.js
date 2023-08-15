const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Log = require('../../models/Log');
const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recalculate')
        .setDescription('Recalculates all durations'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply('You do not have permission to use this command');
            return;
        }

        const logs = await Log.findAll({
            // Group by sourceId
            attributes: [
                'sourceId',
                [Log.sequelize.fn('SUM', Log.sequelize.col('duration')), 'totalDuration'],
            ],
            group: ['sourceId'],
            raw: true,
        });
        console.log(logs);
        
        logs.forEach(async log => {
            const source = await Source.findByPk(log.sourceId);
            source.totalDuration = log.totalDuration;
            await source.save();
        });

        await interaction.reply('Recalculated all durations.');
        
    }
}